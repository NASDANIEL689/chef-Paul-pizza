-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create deals table
create table if not exists public.deals (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    price numeric,
    original_price numeric,
    discount_percentage integer,
    image text not null,
    badge text,
    expiry_date timestamp with time zone not null,
    terms text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create orders table
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    customer_name text not null,
    customer_phone text not null,
    customer_email text,
    delivery_address text,
    items jsonb not null,
    total_amount numeric not null,
    status text not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create order_items table
create table if not exists public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade,
    item_name text not null,
    quantity integer not null,
    price numeric not null,
    special_instructions text,
    created_at timestamp with time zone default now()
);

-- Create users table
create table if not exists public.users (
    id uuid default uuid_generate_v4() primary key,
    email text unique not null,
    password_hash text not null,
    role text not null default 'user',
    created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.deals enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.users enable row level security;

-- Deals table policies
create policy "Anyone can view active deals"
    on public.deals for select
    using (expiry_date > now());

create policy "Authenticated users can manage deals"
    on public.deals for all
    using (auth.role() = 'authenticated');

-- Orders table policies
create policy "Anyone can create orders"
    on public.orders for insert
    with check (true);

create policy "Authenticated users can view orders"
    on public.orders for select
    using (auth.role() = 'authenticated');

create policy "Authenticated users can update orders"
    on public.orders for update
    using (auth.role() = 'authenticated');

-- Order items table policies
create policy "Anyone can create order items"
    on public.order_items for insert
    with check (true);

create policy "Authenticated users can view order items"
    on public.order_items for select
    using (auth.role() = 'authenticated');

-- Users table policies
create policy "Users can view own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update own data"
    on public.users for update
    using (auth.uid() = id);

-- Insert initial deals
insert into public.deals (title, description, price, original_price, image, badge, expiry_date, terms)
values 
    (
        'Family Feast Deal',
        '2 Large Pizzas + 1 Medium Pizza + 2L Soda + Garlic Bread',
        299,
        399,
        'pics/500642364_687730764013396_5545638874431695074_n (3).jpg',
        'Best Value',
        '2024-04-30T23:59:59Z',
        'Valid for dine-in and delivery. Not valid with other offers.'
    ),
    (
        'Weekend Special',
        'Buy 1 Large Pizza, Get 1 Medium Pizza Free + Free Delivery',
        199,
        299,
        'pics/497950856_682776077842198_1598299939128618699_n.jpg',
        'Weekend Only',
        '2024-04-28T23:59:59Z',
        'Valid only on weekends. Delivery within 5km radius.'
    ),
    (
        'Student Discount',
        '20% off on all pizzas with valid student ID',
        null,
        null,
        'pics/ivan-torres-MQUqbmszGGM-unsplash.jpg',
        'Student Special',
        '2024-12-31T23:59:59Z',
        'Must present valid student ID. Not valid with other offers.'
    );

-- Create admin user
insert into auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    role
) values (
    'admin@chefpaul.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    'authenticated'
);

-- Create admin user profile
insert into public.users (
    id,
    email,
    password_hash,
    role
) values (
    (select id from auth.users where email = 'admin@chefpaul.com'),
    'admin@chefpaul.com',
    crypt('admin123', gen_salt('bf')),
    'admin'
); 