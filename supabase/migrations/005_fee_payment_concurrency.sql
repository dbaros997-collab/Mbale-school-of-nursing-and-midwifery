-- High-concurrency fee submissions: indexes + atomic RPCs (single DB transaction each)

alter table fee_payments
  add column if not exists transaction_reference text;

create index if not exists fee_payments_student_created_idx
  on fee_payments (student_id, created_at desc);

create index if not exists fee_payments_transaction_reference_idx
  on fee_payments (lower(trim(transaction_reference)))
  where transaction_reference is not null;

create index if not exists bank_payment_submissions_student_status_idx
  on bank_payment_submissions (student_id, status, submitted_at desc);

create index if not exists bank_payment_submissions_transaction_reference_idx
  on bank_payment_submissions (lower(trim(transaction_reference)));

-- One active claim per bank/mobile reference (pending or approved)
create unique index if not exists bank_payment_submissions_active_reference_uidx
  on bank_payment_submissions (lower(trim(transaction_reference)))
  where status in ('pending_review', 'approved');

create or replace function submit_fee_payment_submission(
  p_student_id text,
  p_invoice_id text,
  p_amount numeric,
  p_payment_method text,
  p_transaction_reference text,
  p_deposit_slip_url text,
  p_deposit_slip_file_name text
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_ref text;
  v_balance numeric := 0;
  v_pending_total numeric := 0;
  v_row bank_payment_submissions%rowtype;
begin
  v_ref := lower(trim(coalesce(p_transaction_reference, '')));
  if v_ref = '' then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Transaction reference is required.'
    );
  end if;

  if p_amount is null or p_amount <= 0 then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Payment amount must be greater than zero.'
    );
  end if;

  if p_payment_method not in ('mtn', 'airtel', 'bank') then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Unsupported payment method.'
    );
  end if;

  -- Per-student serialization; other students are not blocked
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

  if v_pending_total + p_amount > v_balance then
    return jsonb_build_object(
      'ok', false,
      'code', 'AMOUNT_EXCEEDS_BALANCE',
      'message', 'Amount exceeds outstanding balance after pending submissions.'
    );
  end if;

  insert into bank_payment_submissions (
    student_id,
    invoice_id,
    amount,
    payment_method,
    transaction_reference,
    deposit_slip_url,
    deposit_slip_file_name,
    status
  )
  values (
    p_student_id,
    p_invoice_id,
    p_amount,
    p_payment_method,
    trim(p_transaction_reference),
    p_deposit_slip_url,
    p_deposit_slip_file_name,
    'pending_review'
  )
  returning * into v_row;

  return jsonb_build_object(
    'ok', true,
    'submission', jsonb_build_object(
      'id', v_row.id,
      'studentId', v_row.student_id,
      'invoiceId', v_row.invoice_id,
      'amount', v_row.amount,
      'paymentMethod', v_row.payment_method,
      'transactionReference', v_row.transaction_reference,
      'depositSlipUrl', v_row.deposit_slip_url,
      'depositSlipFileName', v_row.deposit_slip_file_name,
      'status', v_row.status,
      'submittedAt', v_row.submitted_at
    )
  );
exception
  when unique_violation then
    return jsonb_build_object(
      'ok', false,
      'code', 'DUPLICATE_REFERENCE',
      'message', 'This transaction reference is already submitted or approved.'
    );
end;
$$;

create or replace function review_fee_payment_submission(
  p_submission_id uuid,
  p_decision text,
  p_verified_reference text,
  p_review_note text
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_row bank_payment_submissions%rowtype;
  v_balance numeric := 0;
  v_new_balance numeric;
  v_payment_id uuid;
  v_ref text;
begin
  if p_decision not in ('approved', 'rejected') then
    return jsonb_build_object(
      'ok', false,
      'code', 'INVALID_INPUT',
      'message', 'Decision must be approved or rejected.'
    );
  end if;

  select *
  into v_row
  from bank_payment_submissions
  where id = p_submission_id
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'code', 'NOT_FOUND',
      'message', 'Payment submission not found.'
    );
  end if;

  if v_row.status <> 'pending_review' then
    return jsonb_build_object(
      'ok', true,
      'code', 'ALREADY_REVIEWED',
      'message', 'Submission was already reviewed.',
      'submission', jsonb_build_object(
        'id', v_row.id,
        'status', v_row.status,
        'paymentRecordId', v_row.payment_record_id
      )
    );
  end if;

  perform pg_advisory_xact_lock(hashtext('fee_pay:' || v_row.student_id));

  if p_decision = 'approved' then
    v_ref := lower(trim(coalesce(nullif(trim(p_verified_reference), ''), v_row.transaction_reference)));

    if exists (
      select 1
      from bank_payment_submissions bps
      where lower(trim(bps.transaction_reference)) = v_ref
        and bps.status = 'approved'
        and bps.id <> v_row.id
    ) then
      return jsonb_build_object(
        'ok', false,
        'code', 'DUPLICATE_REFERENCE',
        'message', 'Verified reference is already tied to an approved payment.'
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
        'message', 'Approved amount exceeds the student''s current balance.'
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
      v_row.payment_method,
      trim(coalesce(nullif(trim(p_verified_reference), ''), v_row.transaction_reference))
    )
    returning id into v_payment_id;

    update bank_payment_submissions
    set
      status = 'approved',
      transaction_reference = trim(coalesce(nullif(trim(p_verified_reference), ''), transaction_reference)),
      review_note = nullif(trim(p_review_note), ''),
      reviewed_at = now(),
      payment_record_id = v_payment_id
    where id = p_submission_id
    returning * into v_row;
  else
    update bank_payment_submissions
    set
      status = 'rejected',
      review_note = nullif(trim(p_review_note), ''),
      reviewed_at = now()
    where id = p_submission_id
    returning * into v_row;
  end if;

  return jsonb_build_object(
    'ok', true,
    'submission', jsonb_build_object(
      'id', v_row.id,
      'studentId', v_row.student_id,
      'status', v_row.status,
      'paymentRecordId', v_row.payment_record_id,
      'transactionReference', v_row.transaction_reference,
      'reviewedAt', v_row.reviewed_at
    )
  );
exception
  when unique_violation then
    return jsonb_build_object(
      'ok', false,
      'code', 'DUPLICATE_REFERENCE',
      'message', 'Verified reference conflicts with another approved payment.'
    );
end;
$$;

grant execute on function submit_fee_payment_submission(
  text, text, numeric, text, text, text, text
) to service_role;

grant execute on function review_fee_payment_submission(
  uuid, text, text, text
) to service_role;
