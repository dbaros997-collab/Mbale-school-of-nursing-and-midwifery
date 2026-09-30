-- Live student portal credentials + remove demo seed rows from core tables

create table if not exists student_portal_accounts (
  student_id text primary key references students (id) on delete cascade,
  user_id text not null unique,
  email text not null,
  password_hash text not null,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists student_portal_accounts_email_idx
  on student_portal_accounts (lower(email));

-- Demo / sample rows shipped in 003_core_academic.sql (safe to remove for production go-live)
delete from online_payment_sessions;
delete from bank_payment_submissions;
delete from fee_payments;
delete from student_portal_activation;
delete from clinical_placements;
delete from student_portal_accounts;
delete from students
where id in ('stu-sarah', 'stu-okello', 'stu-nakato', 'stu-waiswa', 'stu-auma');
