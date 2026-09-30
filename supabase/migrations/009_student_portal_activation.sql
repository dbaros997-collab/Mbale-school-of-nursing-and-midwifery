-- Portal activation credentials (temporary reg + admission letter) — one row per admitted student

create table if not exists student_portal_activation (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students (id) on delete cascade,
  temp_registration_number text not null,
  admission_letter_ref text not null,
  student_number text not null,
  full_name text not null,
  email text not null,
  program_id text not null default 'prog-dn',
  phone text,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint student_portal_activation_student_id_unique unique (student_id),
  constraint student_portal_activation_temp_reg_unique unique (temp_registration_number),
  constraint student_portal_activation_letter_unique unique (admission_letter_ref),
  constraint student_portal_activation_student_number_unique unique (student_number),
  constraint student_portal_activation_temp_reg_format check (
    temp_registration_number ~ '^TMP/MBSNM/[0-9]{4}/[0-9]{3}$'
  ),
  constraint student_portal_activation_letter_format check (
    admission_letter_ref ~ '^ADM-MBSNM-[0-9]{4}-[0-9]{3,4}$'
  ),
  constraint student_portal_activation_student_number_format check (
    student_number ~ '^MBSNM/NS/[0-9]{4}/[0-9]{3}$'
  )
);

create index if not exists student_portal_activation_email_idx
  on student_portal_activation (lower(email));

create index if not exists student_portal_activation_pending_idx
  on student_portal_activation (activated_at)
  where activated_at is null;
