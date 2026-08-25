-- Core academic records: students, courses, clinical placements, fee payments

create table if not exists courses (
  id text primary key,
  course_code text unique not null,
  course_name text not null,
  description text not null default '',
  credits integer not null check (credits > 0),
  created_at timestamptz not null default now()
);

create table if not exists students (
  id text primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  course_enrolled text not null references courses(id) on delete restrict,
  enrollment_date date not null,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'pending', 'graduated', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clinical_placements (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  facility_name text not null,
  supervisor_name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint clinical_placements_dates_check check (end_date >= start_date)
);

create table if not exists fee_payments (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  amount_paid numeric not null check (amount_paid >= 0),
  balance_due numeric not null check (balance_due >= 0),
  payment_date date not null,
  payment_method text not null
    check (payment_method in ('mtn', 'airtel', 'bank', 'cash')),
  created_at timestamptz not null default now()
);

create index if not exists students_course_enrolled_idx on students (course_enrolled);
create index if not exists students_status_idx on students (status);
create index if not exists clinical_placements_student_idx on clinical_placements (student_id);
create index if not exists clinical_placements_status_idx on clinical_placements (status);
create index if not exists fee_payments_student_idx on fee_payments (student_id);
create index if not exists fee_payments_payment_date_idx on fee_payments (payment_date desc);

-- Programme / training module catalogue
insert into courses (id, course_code, course_name, description, credits) values
  (
    'course-dn-direct',
    'DN-DIRECT',
    'Diploma in Nursing (Direct)',
    'Two-year direct-entry nursing programme covering clinical care, pharmacology, community health, and professional ethics.',
    120
  ),
  (
    'course-dn-extension',
    'DN-EXT',
    'Diploma in Nursing (Extension)',
    'Upgrade pathway for certified nurses seeking diploma-level competence and expanded clinical responsibility.',
    90
  ),
  (
    'course-cn',
    'CN',
    'Certificate in Nursing',
    'Foundational nursing education focused on bedside care, infection prevention, and compassionate service.',
    100
  ),
  (
    'course-dm-direct',
    'DM-DIRECT',
    'Diploma in Midwifery (Direct)',
    'Direct-entry midwifery programme preparing students for safe motherhood and skilled birth attendance.',
    120
  ),
  (
    'course-nsg1101',
    'NSG1101',
    'Fundamentals of Nursing',
    'Core principles of nursing practice, patient assessment, and basic clinical skills.',
    4
  ),
  (
    'course-nsg2101',
    'NSG2101',
    'Adult Health Nursing',
    'Medical-surgical nursing concepts with supervised ward practice.',
    4
  ),
  (
    'course-nsg2104',
    'NSG2104',
    'Clinical Practicum I',
    'Supervised clinical rotation at partner hospitals and community health sites.',
    6
  )
on conflict (id) do nothing;

-- Students
insert into students (id, full_name, email, phone, course_enrolled, enrollment_date, status) values
  ('stu-sarah', 'Nagudi Sarah', 'nagudi.sarah@student.mbsnm.org', '+256 700 123 456', 'course-dn-direct', '2024-08-01', 'active'),
  ('stu-okello', 'Okello Brian', 'okello.brian@student.mbsnm.org', '+256 772 441 902', 'course-dn-direct', '2024-08-02', 'active'),
  ('stu-nakato', 'Nakato Esther', 'nakato.esther@student.mbsnm.org', '+256 705 662 118', 'course-dn-direct', '2025-01-15', 'active'),
  ('stu-waiswa', 'Waiswa Daniel', 'waiswa.daniel@student.mbsnm.org', '+256 781 334 055', 'course-dn-direct', '2025-01-18', 'active'),
  ('stu-auma', 'Auma Grace', 'auma.grace@student.mbsnm.org', '+256 702 889 441', 'course-cn', '2026-02-01', 'pending')
on conflict (id) do nothing;

-- Clinical placements
insert into clinical_placements (student_id, facility_name, supervisor_name, start_date, end_date, status) values
  ('stu-sarah', 'Mbale Referral Hospital', 'Sr. Rebecca Namukasa', '2025-09-01', '2025-12-15', 'active'),
  ('stu-sarah', 'CURE Children''s Hospital of Uganda', 'Dr. James Okello', '2026-01-10', '2026-03-20', 'scheduled'),
  ('stu-okello', 'Mbale Regional Referral Hospital — Medical Ward', 'Sr. Patricia Ayo', '2025-09-01', '2025-11-30', 'completed'),
  ('stu-nakato', 'Busia Health Centre IV', 'Sr. Miriam Chemutai', '2026-02-01', '2026-04-30', 'active'),
  ('stu-waiswa', 'Mbale Referral Hospital — Maternity', 'Sr. Faith Nabwire', '2025-10-01', '2026-01-15', 'completed')
on conflict do nothing;

-- Fee payments
insert into fee_payments (student_id, amount_paid, balance_due, payment_date, payment_method) values
  ('stu-sarah', 500000, 450000, '2025-01-20', 'mtn'),
  ('stu-sarah', 500000, 950000, '2024-09-05', 'bank'),
  ('stu-okello', 1450000, 0, '2025-02-01', 'bank'),
  ('stu-nakato', 730000, 720000, '2025-02-10', 'airtel'),
  ('stu-waiswa', 625000, 200000, '2025-03-01', 'mtn'),
  ('stu-waiswa', 625000, 825000, '2024-10-15', 'bank')
on conflict do nothing;
