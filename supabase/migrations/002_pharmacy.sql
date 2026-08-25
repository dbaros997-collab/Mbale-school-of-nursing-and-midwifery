-- Pharmacy module: medication stock, prescriptions, automated orders

create table if not exists medications (
  id text primary key,
  sku text unique not null,
  name text not null,
  strength text not null,
  form text not null
    check (form in ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops')),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  reorder_level integer not null default 0,
  unit_price_ugx numeric not null default 0,
  requires_prescription boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prescriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  customer_name text not null,
  file_name text not null,
  file_url text,
  notes text default '',
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'stock_validated', 'processing', 'ready', 'fulfilled', 'stock_unavailable', 'cancelled')),
  line_items jsonb not null default '[]',
  order_id uuid,
  stock_validated_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pharmacy_orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text unique not null,
  prescription_id uuid not null references prescriptions(id) on delete cascade,
  customer_id text not null,
  customer_name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'validated', 'processing', 'ready', 'fulfilled', 'cancelled', 'stock_failed')),
  total_amount_ugx numeric not null default 0,
  line_items jsonb not null default '[]',
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz
);

create index if not exists prescriptions_customer_idx on prescriptions (customer_id, created_at desc);
create index if not exists prescriptions_status_idx on prescriptions (status);
create index if not exists pharmacy_orders_status_idx on pharmacy_orders (status);
create index if not exists medications_sku_idx on medications (sku);

-- Seed medication catalogue with stock levels
insert into medications (id, sku, name, strength, form, stock_quantity, reorder_level, unit_price_ugx, requires_prescription) values
  ('med-paracetamol-500', 'RX-PAR-500', 'Paracetamol', '500mg', 'tablet', 420, 100, 500, false),
  ('med-amox-500', 'RX-AMX-500', 'Amoxicillin', '500mg', 'capsule', 85, 50, 1200, true),
  ('med-metformin-500', 'RX-MET-500', 'Metformin', '500mg', 'tablet', 160, 40, 800, true),
  ('med-omeprazole-20', 'RX-OME-20', 'Omeprazole', '20mg', 'capsule', 12, 30, 1500, true),
  ('med-cetirizine-10', 'RX-CET-10', 'Cetirizine', '10mg', 'tablet', 200, 50, 600, false),
  ('med-salbutamol-inh', 'RX-SAL-INH', 'Salbutamol inhaler', '100mcg', 'drops', 28, 15, 8500, true),
  ('med-ors-sachet', 'RX-ORS-1', 'Oral rehydration salts', '1 sachet', 'syrup', 350, 80, 400, false),
  ('med-diclofenac-gel', 'RX-DIC-GEL', 'Diclofenac gel', '1%', 'cream', 45, 20, 4500, true),
  ('med-artemether-lum', 'RX-ALU', 'Artemether/Lumefantrine', '20/120mg', 'tablet', 0, 25, 3500, true),
  ('med-insulin-nph', 'RX-INS-NPH', 'Insulin NPH', '100IU/ml', 'injection', 18, 10, 45000, true)
on conflict (id) do nothing;

-- RPC: validate stock and reserve (atomic check)
create or replace function validate_pharmacy_stock(p_line_items jsonb)
returns jsonb
language plpgsql
as $$
declare
  item jsonb;
  med record;
  errors jsonb := '[]'::jsonb;
  results jsonb := '[]'::jsonb;
  req_qty integer;
begin
  for item in select * from jsonb_array_elements(p_line_items)
  loop
    select * into med from medications where id = item->>'medicationId' and active = true;
    if not found then
      errors := errors || jsonb_build_object('message', 'Unknown medication: ' || (item->>'medicationId'));
      continue;
    end if;
    req_qty := (item->>'quantity')::integer;
    results := results || jsonb_build_object(
      'medicationId', med.id,
      'medicationName', med.name || ' ' || med.strength,
      'requested', req_qty,
      'available', med.stock_quantity,
      'sufficient', med.stock_quantity >= req_qty
    );
    if med.stock_quantity < req_qty then
      errors := errors || jsonb_build_object(
        'message', med.name || ': requested ' || req_qty || ', only ' || med.stock_quantity || ' in stock'
      );
    end if;
  end loop;
  return jsonb_build_object('valid', jsonb_array_length(errors) = 0, 'errors', errors, 'lineResults', results);
end;
$$;
