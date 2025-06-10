import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://inajemonfduateakwipa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODg2NiwiZXhwIjoyMDY0OTU0ODY2fQ.mO8zpQww9-qHEhtpcwVlrSNsFEN_Ts4tvif_a-AImF8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
    try {
        // Create deals table
        const { error: dealsError } = await supabase
            .from('deals')
            .select('*')
            .limit(1)
            .then(() => ({ error: null }))
            .catch(async () => {
                return await supabase.rpc('create_deals_table')
            })

        if (dealsError) {
            console.error('Error creating deals table:', dealsError)
            return
        }
        console.log('Deals table created successfully')

        // Create orders table
        const { error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .limit(1)
            .then(() => ({ error: null }))
            .catch(async () => {
                return await supabase.rpc('create_orders_table')
            })

        if (ordersError) {
            console.error('Error creating orders table:', ordersError)
            return
        }
        console.log('Orders table created successfully')

        // Create order_items table
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .select('*')
            .limit(1)
            .then(() => ({ error: null }))
            .catch(async () => {
                return await supabase.rpc('create_order_items_table')
            })

        if (orderItemsError) {
            console.error('Error creating order_items table:', orderItemsError)
            return
        }
        console.log('Order items table created successfully')

        // Create users table
        const { error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1)
            .then(() => ({ error: null }))
            .catch(async () => {
                return await supabase.rpc('create_users_table')
            })

        if (usersError) {
            console.error('Error creating users table:', usersError)
            return
        }
        console.log('Users table created successfully')

        // Insert initial deals
        const initialDeals = [
            {
                title: "Family Feast Deal",
                description: "2 Large Pizzas + 1 Medium Pizza + 2L Soda + Garlic Bread",
                price: 299,
                original_price: 399,
                image: "pics/500642364_687730764013396_5545638874431695074_n (3).jpg",
                badge: "Best Value",
                expiry_date: "2024-04-30T23:59:59Z",
                terms: "Valid for dine-in and delivery. Not valid with other offers."
            },
            {
                title: "Weekend Special",
                description: "Buy 1 Large Pizza, Get 1 Medium Pizza Free + Free Delivery",
                price: 199,
                original_price: 299,
                image: "pics/497950856_682776077842198_1598299939128618699_n.jpg",
                badge: "Weekend Only",
                expiry_date: "2024-04-28T23:59:59Z",
                terms: "Valid only on weekends. Delivery within 5km radius."
            },
            {
                title: "Student Discount",
                description: "20% off on all pizzas with valid student ID",
                discount_percentage: 20,
                image: "pics/ivan-torres-MQUqbmszGGM-unsplash.jpg",
                badge: "Student Special",
                expiry_date: "2024-12-31T23:59:59Z",
                terms: "Must present valid student ID. Not valid with other offers."
            }
        ]

        // Check if deals already exist
        const { data: existingDeals } = await supabase
            .from('deals')
            .select('*')
            .limit(1)

        if (!existingDeals || existingDeals.length === 0) {
            const { error: insertError } = await supabase
                .from('deals')
                .insert(initialDeals)

            if (insertError) {
                console.error('Error inserting initial deals:', insertError)
                return
            }
            console.log('Initial deals inserted successfully')
        } else {
            console.log('Deals already exist, skipping insertion')
        }

        console.log('Database setup completed successfully!')
    } catch (error) {
        console.error('Error setting up database:', error)
    }
}

// First, create the SQL functions
async function createSQLFunctions() {
    try {
        // Create deals table function
        const { error: dealsFuncError } = await supabase.rpc('create_function', {
            function_name: 'create_deals_table',
            function_definition: `
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
                
                alter table public.deals enable row level security;
                
                create policy "Anyone can view active deals"
                    on public.deals for select
                    using (expiry_date > now());
                
                create policy "Authenticated users can manage deals"
                    on public.deals for all
                    using (auth.role() = 'authenticated');
            `
        })
        if (dealsFuncError) throw dealsFuncError

        // Create orders table function
        const { error: ordersFuncError } = await supabase.rpc('create_function', {
            function_name: 'create_orders_table',
            function_definition: `
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
                
                alter table public.orders enable row level security;
                
                create policy "Anyone can create orders"
                    on public.orders for insert
                    with check (true);
                
                create policy "Authenticated users can view orders"
                    on public.orders for select
                    using (auth.role() = 'authenticated');
                
                create policy "Authenticated users can update orders"
                    on public.orders for update
                    using (auth.role() = 'authenticated');
            `
        })
        if (ordersFuncError) throw ordersFuncError

        // Create order_items table function
        const { error: orderItemsFuncError } = await supabase.rpc('create_function', {
            function_name: 'create_order_items_table',
            function_definition: `
                create table if not exists public.order_items (
                    id uuid default uuid_generate_v4() primary key,
                    order_id uuid references public.orders(id) on delete cascade,
                    item_name text not null,
                    quantity integer not null,
                    price numeric not null,
                    special_instructions text,
                    created_at timestamp with time zone default now()
                );
                
                alter table public.order_items enable row level security;
                
                create policy "Anyone can create order items"
                    on public.order_items for insert
                    with check (true);
                
                create policy "Authenticated users can view order items"
                    on public.order_items for select
                    using (auth.role() = 'authenticated');
            `
        })
        if (orderItemsFuncError) throw orderItemsFuncError

        // Create users table function
        const { error: usersFuncError } = await supabase.rpc('create_function', {
            function_name: 'create_users_table',
            function_definition: `
                create table if not exists public.users (
                    id uuid default uuid_generate_v4() primary key,
                    email text unique not null,
                    password_hash text not null,
                    role text not null default 'user',
                    created_at timestamp with time zone default now()
                );
                
                alter table public.users enable row level security;
                
                create policy "Users can view own data"
                    on public.users for select
                    using (auth.uid() = id);
                
                create policy "Users can update own data"
                    on public.users for update
                    using (auth.uid() = id);
            `
        })
        if (usersFuncError) throw usersFuncError

        console.log('SQL functions created successfully')
    } catch (error) {
        console.error('Error creating SQL functions:', error)
    }
}

// Run the setup
async function setup() {
    await createSQLFunctions()
    await setupDatabase()
}

setup() 