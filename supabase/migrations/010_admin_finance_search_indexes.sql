-- Admin finance dashboard: search, filter, and sort at scale (1k+ students)

create index if not exists students_full_name_lower_idx
  on students (lower(full_name));

create index if not exists students_email_lower_idx
  on students (lower(email));

create index if not exists student_portal_activation_full_name_idx
  on student_portal_activation (lower(full_name));

create index if not exists student_portal_activation_student_number_idx
  on student_portal_activation (student_number);

create index if not exists student_portal_activation_created_desc_idx
  on student_portal_activation (created_at desc);

create index if not exists student_portal_activation_pending_created_idx
  on student_portal_activation (created_at desc)
  where activated_at is null;

create index if not exists fee_payments_created_desc_idx
  on fee_payments (created_at desc);

analyze students;
analyze student_portal_activation;
analyze fee_payments;
