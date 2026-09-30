-- Student bank / mobile fee submissions pending finance verification

create table if not exists bank_payment_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  invoice_id text,
  amount numeric not null check (amount > 0),
  payment_method text not null
    check (payment_method in ('mtn', 'airtel', 'bank')),
  transaction_reference text not null,
  deposit_slip_url text,
  deposit_slip_file_name text,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected')),
  review_note text,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  payment_record_id uuid references fee_payments(id) on delete set null
);

create index if not exists bank_payment_submissions_student_idx
  on bank_payment_submissions (student_id);

create index if not exists bank_payment_submissions_status_idx
  on bank_payment_submissions (status, submitted_at desc);

-- Demo queue item for finance staff (Waiswa — partial bank payment awaiting slip check)
insert into bank_payment_submissions (
  student_id,
  invoice_id,
  amount,
  payment_method,
  transaction_reference,
  deposit_slip_file_name,
  status,
  submitted_at
) values (
  'stu-waiswa',
  'inv-waiswa-2025-1',
  200000,
  'bank',
  '9030012345678',
  'waiswa-deposit-slip-march.jpg',
  'pending_review',
  now() - interval '2 days'
)
on conflict do nothing;
