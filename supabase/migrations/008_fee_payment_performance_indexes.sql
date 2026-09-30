-- Fee / payment query performance (student balance, verification queue, gateway settlement)
-- Run ANALYZE after deploy so the planner uses fresh statistics.

-- Hot path: latest balance per student (all payment RPCs)
drop index if exists fee_payments_student_created_idx;

create index if not exists fee_payments_student_latest_idx
  on fee_payments (student_id, created_at desc)
  include (balance_due, amount_paid);

-- Admin verification queue: status = pending_review ORDER BY submitted_at DESC
create index if not exists bank_payment_submissions_pending_queue_idx
  on bank_payment_submissions (submitted_at desc)
  where status = 'pending_review';

-- Per-student pending bank total (submit_fee_payment_submission)
create index if not exists bank_payment_submissions_student_pending_idx
  on bank_payment_submissions (student_id)
  where status = 'pending_review';

-- Per-student pending online checkout total (register_online_payment_session)
create index if not exists online_payment_sessions_student_pending_idx
  on online_payment_sessions (student_id)
  where status = 'pending';

-- Idempotent gateway settlement lookups (tx_ref unique constraint already exists; INCLUDE for index-only checks)
create index if not exists online_payment_sessions_tx_ref_status_idx
  on online_payment_sessions (tx_ref)
  include (status, student_id, amount);

analyze fee_payments;
analyze bank_payment_submissions;
analyze online_payment_sessions;
