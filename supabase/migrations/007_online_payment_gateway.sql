-- Online payment gateway sessions (Flutterwave / Pesapal) + atomic webhook settlement

alter table fee_payments
  drop constraint if exists fee_payments_payment_method_check;

alter table fee_payments
  add constraint fee_payments_payment_method_check
  check (payment_method in ('mtn', 'airtel', 'bank', 'cash', 'online'));

create table if not exists online_payment_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  invoice_id text,
  amount numeric not null check (amount > 0),
  currency text not null default 'UGX',
  tx_ref text not null unique,
  gateway text not null default 'flutterwave'
    check (gateway in ('flutterwave', 'pesapal')),
  gateway_transaction_id text,
  payment_channel text,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'failed', 'cancelled')),
  payment_record_id uuid references fee_payments(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  failure_reason text
);

create unique index if not exists online_payment_sessions_gateway_tx_uidx
  on online_payment_sessions (gateway, gateway_transaction_id)
  where gateway_transaction_id is not null and status = 'completed';

create index if not exists online_payment_sessions_student_status_idx
  on online_payment_sessions (student_id, status, created_at desc);

create or replace function register_online_payment_session(
  p_student_id text,
  p_invoice_id text,
  p_amount numeric,
  p_tx_ref text,
  p_gateway text default 'flutterwave'
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_balance numeric := 0;
  v_pending_total numeric := 0;
  v_online_pending numeric := 0;
  v_row online_payment_sessions%rowtype;
begin
  if p_amount is null or p_amount <= 0 then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Payment amount must be greater than zero.'
    );
  end if;

  if trim(coalesce(p_tx_ref, '')) = '' then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Transaction reference is required.'
    );
  end if;

  perform pg_advisory_xact_lock(hashtext('fee_pay:' || p_student_id));

  if not exists (select 1 from students where id = p_student_id) then
    return jsonb_build_object(
      'ok', false,
      'code', 'STUDENT_NOT_FOUND',
      'message', 'Student not found.'
    );
  end if;

  select coalesce(fp.balance_due, 0)
  into v_balance
  from fee_payments fp
  where fp.student_id = p_student_id
  order by fp.created_at desc
  limit 1
  for update;

  select coalesce(sum(bps.amount), 0)
  into v_pending_total
  from bank_payment_submissions bps
  where bps.student_id = p_student_id
    and bps.status = 'pending_review';

  select coalesce(sum(ops.amount), 0)
  into v_online_pending
  from online_payment_sessions ops
  where ops.student_id = p_student_id
    and ops.status = 'pending';

  if v_pending_total + v_online_pending + p_amount > v_balance then
    return jsonb_build_object(
      'ok', false,
      'code', 'AMOUNT_EXCEEDS_BALANCE',
      'message', 'Amount exceeds outstanding balance after pending payments.'
    );
  end if;

  insert into online_payment_sessions (
    student_id,
    invoice_id,
    amount,
    tx_ref,
    gateway,
    status
  )
  values (
    p_student_id,
    p_invoice_id,
    p_amount,
    trim(p_tx_ref),
    coalesce(nullif(trim(p_gateway), ''), 'flutterwave'),
    'pending'
  )
  returning * into v_row;

  return jsonb_build_object(
    'ok', true,
    'session', jsonb_build_object(
      'id', v_row.id,
      'studentId', v_row.student_id,
      'invoiceId', v_row.invoice_id,
      'amount', v_row.amount,
      'currency', v_row.currency,
      'txRef', v_row.tx_ref,
      'gateway', v_row.gateway,
      'status', v_row.status
    )
  );
exception
  when unique_violation then
    return jsonb_build_object(
      'ok', false,
      'code', 'DUPLICATE_REFERENCE',
      'message', 'This payment reference is already in use.'
    );
end;
$$;

create or replace function settle_online_fee_payment(
  p_tx_ref text,
  p_gateway_transaction_id text,
  p_status text,
  p_settled_amount numeric,
  p_payment_channel text,
  p_failure_reason text default null
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_row online_payment_sessions%rowtype;
  v_balance numeric := 0;
  v_new_balance numeric;
  v_payment_id uuid;
  v_ref text;
begin
  v_ref := trim(coalesce(p_tx_ref, ''));
  if v_ref = '' then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'tx_ref is required.'
    );
  end if;

  select *
  into v_row
  from online_payment_sessions
  where tx_ref = v_ref
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'code', 'NOT_FOUND',
      'message', 'Online payment session not found.'
    );
  end if;

  if v_row.status = 'completed' then
    return jsonb_build_object(
      'ok', true,
      'code', 'ALREADY_SETTLED',
      'message', 'Payment was already settled.',
      'session', jsonb_build_object(
        'id', v_row.id,
        'studentId', v_row.student_id,
        'status', v_row.status,
        'paymentRecordId', v_row.payment_record_id,
        'txRef', v_row.tx_ref
      )
    );
  end if;

  if p_status not in ('successful', 'failed', 'cancelled') then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Unsupported settlement status.'
    );
  end if;

  perform pg_advisory_xact_lock(hashtext('fee_pay:' || v_row.student_id));

  if p_status <> 'successful' then
    update online_payment_sessions
    set
      status = case when p_status = 'cancelled' then 'cancelled' else 'failed' end,
      gateway_transaction_id = nullif(trim(coalesce(p_gateway_transaction_id, '')), ''),
      payment_channel = nullif(trim(coalesce(p_payment_channel, '')), ''),
      failure_reason = nullif(trim(coalesce(p_failure_reason, '')), ''),
      completed_at = now()
    where id = v_row.id
    returning * into v_row;

    return jsonb_build_object(
      'ok', true,
      'session', jsonb_build_object(
        'id', v_row.id,
        'studentId', v_row.student_id,
        'status', v_row.status,
        'txRef', v_row.tx_ref
      )
    );
  end if;

  if p_settled_amount is null or p_settled_amount <= 0 then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Settled amount must be greater than zero.'
    );
  end if;

  if round(p_settled_amount::numeric, 2) <> round(v_row.amount::numeric, 2) then
    return jsonb_build_object(
      'ok', false,
      'code', 'AMOUNT_MISMATCH',
      'message', 'Gateway amount does not match the registered session amount.'
    );
  end if;

  if nullif(trim(coalesce(p_gateway_transaction_id, '')), '') is not null
    and exists (
      select 1
      from online_payment_sessions ops
      where ops.gateway_transaction_id = trim(p_gateway_transaction_id)
        and ops.status = 'completed'
        and ops.id <> v_row.id
    ) then
    return jsonb_build_object(
      'ok', false,
      'code', 'DUPLICATE_GATEWAY_TX',
      'message', 'Gateway transaction id was already used for another payment.'
    );
  end if;

  select coalesce(fp.balance_due, 0)
  into v_balance
  from fee_payments fp
  where fp.student_id = v_row.student_id
  order by fp.created_at desc
  limit 1
  for update;

  if v_row.amount > v_balance then
    return jsonb_build_object(
      'ok', false,
      'code', 'AMOUNT_EXCEEDS_BALANCE',
      'message', 'Settled amount exceeds the student''s current balance.'
    );
  end if;

  v_new_balance := greatest(0, v_balance - v_row.amount);

  insert into fee_payments (
    student_id,
    amount_paid,
    balance_due,
    payment_date,
    payment_method,
    transaction_reference
  )
  values (
    v_row.student_id,
    v_row.amount,
    v_new_balance,
    current_date,
    'online',
    trim(coalesce(nullif(trim(p_gateway_transaction_id), ''), v_row.tx_ref))
  )
  returning id into v_payment_id;

  update online_payment_sessions
  set
    status = 'completed',
    gateway_transaction_id = nullif(trim(coalesce(p_gateway_transaction_id, '')), ''),
    payment_channel = nullif(trim(coalesce(p_payment_channel, '')), ''),
    payment_record_id = v_payment_id,
    completed_at = now(),
    failure_reason = null
  where id = v_row.id
  returning * into v_row;

  return jsonb_build_object(
    'ok', true,
    'session', jsonb_build_object(
      'id', v_row.id,
      'studentId', v_row.student_id,
      'status', v_row.status,
      'paymentRecordId', v_row.payment_record_id,
      'txRef', v_row.tx_ref,
      'gatewayTransactionId', v_row.gateway_transaction_id
    )
  );
exception
  when unique_violation then
    return jsonb_build_object(
      'ok', false,
      'code', 'DUPLICATE_GATEWAY_TX',
      'message', 'Gateway transaction conflicts with another completed payment.'
    );
end;
$$;

grant execute on function register_online_payment_session(text, text, numeric, text, text)
  to service_role;

grant execute on function settle_online_fee_payment(text, text, text, numeric, text, text)
  to service_role;

do $$
begin
  alter publication supabase_realtime add table online_payment_sessions;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table fee_payments;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
