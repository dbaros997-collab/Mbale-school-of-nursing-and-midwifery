-- Admin analytics: inquiries, products (programmes), and orders
-- Run in Supabase SQL editor or via supabase db push

create table if not exists products (
  id text primary key,
  title text not null,
  category text not null,
  level text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  category text not null default 'general',
  product_id text references products(id) on delete set null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'resolved', 'closed')),
  source text not null default 'contact_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text unique not null,
  customer_name text not null,
  customer_email text not null,
  product_id text references products(id) on delete set null,
  amount_ugx numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);
create index if not exists inquiries_status_idx on inquiries (status);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_at_idx on orders (created_at desc);

-- Seed programme catalogue
insert into products (id, title, category, level) values
  ('diploma-nursing-direct', 'Diploma in Nursing (Direct)', 'Nursing', 'Diploma'),
  ('diploma-nursing-extension', 'Diploma in Nursing (Extension)', 'Nursing', 'Diploma'),
  ('certificate-nursing', 'Certificate in Nursing', 'Nursing', 'Certificate'),
  ('diploma-midwifery-direct', 'Diploma in Midwifery (Direct)', 'Midwifery', 'Diploma'),
  ('diploma-midwifery-extension', 'Diploma in Midwifery (Extension)', 'Midwifery', 'Diploma'),
  ('certificate-midwifery', 'Certificate in Midwifery', 'Midwifery', 'Certificate')
on conflict (id) do nothing;

-- Sample inquiries
insert into inquiries (full_name, email, phone, category, product_id, message, status, source, created_at) values
  ('Grace Namuli', 'grace.n@example.com', '+256 701 234 567', 'admissions', 'diploma-nursing-direct', 'I would like to know the June 2026 intake requirements for direct-entry nursing.', 'new', 'contact_form', now() - interval '2 hours'),
  ('James Okello', 'j.okello@example.com', '+256 772 890 123', 'admissions', 'certificate-nursing', 'Can I apply with UCE passes only?', 'in_progress', 'contact_form', now() - interval '1 day'),
  ('Sarah Achieng', 's.achieng@example.com', null, 'general', null, 'Do you offer accommodation on campus?', 'resolved', 'contact_form', now() - interval '3 days'),
  ('Peter Musoke', 'p.musoke@example.com', '+256 779 111 222', 'admissions', 'diploma-midwifery-direct', 'What clinical sites are used for midwifery training?', 'new', 'website_chat', now() - interval '5 hours'),
  ('Faith Nabwire', 'faith.n@example.com', '+256 700 333 444', 'admissions', 'diploma-nursing-extension', 'I hold a certificate in nursing — am I eligible for the extension programme?', 'in_progress', 'contact_form', now() - interval '2 days'),
  ('David Ssebunya', 'd.sseb@example.com', null, 'fees', 'diploma-nursing-direct', 'Please send the current tuition and functional fees breakdown.', 'resolved', 'contact_form', now() - interval '5 days'),
  ('Mary Nalubega', 'mary.n@example.com', '+256 751 555 666', 'admissions', 'certificate-midwifery', 'When does the July 2026 intake close?', 'new', 'contact_form', now() - interval '8 hours'),
  ('Robert Kato', 'r.kato@example.com', '+256 782 777 888', 'general', null, 'Can I visit the campus before applying?', 'closed', 'contact_form', now() - interval '10 days');

-- Sample orders (application / fee orders)
insert into orders (order_reference, customer_name, customer_email, product_id, amount_ugx, status, payment_status, created_at, completed_at) values
  ('MBSNM-ORD-2026-0142', 'Grace Namuli', 'grace.n@example.com', 'diploma-nursing-direct', 20000, 'processing', 'paid', now() - interval '2 hours', null),
  ('MBSNM-ORD-2026-0138', 'James Okello', 'j.okello@example.com', 'certificate-nursing', 20000, 'pending', 'unpaid', now() - interval '1 day', null),
  ('MBSNM-ORD-2026-0125', 'Sarah Achieng', 's.achieng@example.com', 'diploma-midwifery-direct', 20000, 'completed', 'paid', now() - interval '4 days', now() - interval '3 days'),
  ('MBSNM-ORD-2026-0119', 'Peter Musoke', 'p.musoke@example.com', 'diploma-midwifery-direct', 20000, 'processing', 'paid', now() - interval '5 hours', null),
  ('MBSNM-ORD-2026-0104', 'Faith Nabwire', 'faith.n@example.com', 'diploma-nursing-extension', 20000, 'completed', 'paid', now() - interval '6 days', now() - interval '5 days'),
  ('MBSNM-ORD-2026-0098', 'David Ssebunya', 'd.sseb@example.com', 'diploma-nursing-direct', 20000, 'failed', 'unpaid', now() - interval '7 days', null),
  ('MBSNM-ORD-2026-0087', 'Mary Nalubega', 'mary.n@example.com', 'certificate-midwifery', 20000, 'pending', 'unpaid', now() - interval '8 hours', null),
  ('MBSNM-ORD-2026-0076', 'Robert Kato', 'r.kato@example.com', 'certificate-nursing', 20000, 'cancelled', 'refunded', now() - interval '12 days', null),
  ('MBSNM-ORD-2026-0065', 'Anita Wanyama', 'a.wanyama@example.com', 'diploma-nursing-direct', 20000, 'completed', 'paid', now() - interval '14 days', now() - interval '13 days'),
  ('MBSNM-ORD-2026-0054', 'John Opio', 'j.opio@example.com', 'diploma-midwifery-extension', 20000, 'completed', 'paid', now() - interval '16 days', now() - interval '15 days')
on conflict (order_reference) do nothing;
