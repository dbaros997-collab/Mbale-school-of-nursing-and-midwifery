-- Manual verification: run against staging/production with EXPLAIN (ANALYZE, BUFFERS)
-- Target: Index Scan or Index Only Scan, execution time well under 10ms at expected row counts.

-- Latest student balance (payment RPC inner loop)
explain (analyze, buffers, format text)
select coalesce(fp.balance_due, 0)
from fee_payments fp
where fp.student_id = 'stu-sarah'
order by fp.created_at desc
limit 1;

-- Pending bank submissions for one student
explain (analyze, buffers, format text)
select coalesce(sum(bps.amount), 0)
from bank_payment_submissions bps
where bps.student_id = 'stu-sarah'
  and bps.status = 'pending_review';

-- Finance verification queue
explain (analyze, buffers, format text)
select id, student_id, amount, transaction_reference, submitted_at
from bank_payment_submissions
where status = 'pending_review'
order by submitted_at desc
limit 50;

-- Online payment webhook session lock
explain (analyze, buffers, format text)
select id, student_id, amount, status
from online_payment_sessions
where tx_ref = 'MBS-FEE-SAMPLE-TX-REF'
for update;

-- Transaction reference deduplication
explain (analyze, buffers, format text)
select 1
from bank_payment_submissions bps
where lower(trim(bps.transaction_reference)) = lower(trim('9030012345678'))
  and bps.status = 'approved'
limit 1;
