
-- 1. Profile shipping defaults
alter table public.profiles
  add column if not exists shipping_address text,
  add column if not exists shipping_city text,
  add column if not exists shipping_district text,
  add column if not exists shipping_postcode text,
  add column if not exists shipping_phone text;

-- 2. Orders
create type public.order_status as enum ('pending','confirmed','shipped','delivered','cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  status public.order_status not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  item_count integer not null default 0,
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  shipping_city text,
  shipping_district text not null,
  shipping_postcode text,
  notes text,
  payment_method text not null default 'cod',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_idx on public.orders(customer_id, created_at desc);
create index orders_status_idx on public.orders(status);

alter table public.orders enable row level security;

create policy "Customers view own orders" on public.orders
  for select to authenticated using (auth.uid() = customer_id);

create policy "Customers create own orders" on public.orders
  for insert to authenticated with check (auth.uid() = customer_id);

create policy "Admins view all orders" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Admins manage orders" on public.orders
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- 3. Order items (denormalised — mock products/farmers are still text ids)
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_title text not null,
  product_title_bn text,
  product_image text,
  unit text,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null,
  farmer_id text,
  farmer_name text,
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items(order_id);
create index order_items_farmer_idx on public.order_items(farmer_id);

alter table public.order_items enable row level security;

create policy "Customers view own order items" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.customer_id = auth.uid())
  );

create policy "Customers create own order items" on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.customer_id = auth.uid())
  );

create policy "Admins view all order items" on public.order_items
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- 4. Realtime
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter table public.orders replica identity full;
alter table public.order_items replica identity full;
