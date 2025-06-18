import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inajemonfduateakwipa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg4NjYsImV4cCI6MjA2NDk1NDg2Nn0.51lDpvWL4PwELHpv4cVoky8xOzIA0OdJY0mYkSXdus4';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODg2NiwiZXhwIjoyMDY0OTU0ODY2fQ.mO8zpQww9-qHEhtpcwVlrSNsFEN_Ts4tvif_a-AImF8';

// Public client for client-side operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Admin client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabase, supabaseAdmin };

// Example: You can add and export your dealFunctions, orderFunctions, etc. here as needed
// For now, this file just provides the clients for use in other modules.

export const orderFunctions = {
  // Create new order
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Get all orders
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Get active orders
  async getActiveOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing', 'ready'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Get order statistics
  async getOrderStats() {
    const { count: totalOrders, error: totalError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true });
    const { count: activeOrders, error: activeError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'preparing', 'ready']);
    const { data: avgOrderValue, error: avgError } = await supabase
      .from('orders')
      .select('total_amount');
    if (totalError || activeError || avgError) throw new Error('Error fetching statistics');
    const avgValue = avgOrderValue.length > 0 ? avgOrderValue.reduce((sum, order) => sum + (order.total_amount || 0), 0) / avgOrderValue.length : 0;
    return {
      totalOrders: totalOrders || 0,
      activeOrders: activeOrders || 0,
      avgOrderValue: avgValue
    };
  }
};

/**
 * Programmatically create the required tables in Supabase using the service role client.
 * This requires a custom RPC function (e.g., 'exec_sql') to be set up in your Supabase instance.
 * If not available, provide instructions to use the SQL editor manually.
 */
export async function createTables() {
  // SQL for all tables
  const sql = `
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
    create table if not exists public.order_items (
        id uuid default uuid_generate_v4() primary key,
        order_id uuid references public.orders(id) on delete cascade,
        item_name text not null,
        quantity integer not null,
        price numeric not null,
        special_instructions text,
        created_at timestamp with time zone default now()
    );
    create table if not exists public.users (
        id uuid default uuid_generate_v4() primary key,
        email text unique not null,
        password_hash text not null,
        role text not null default 'user',
        created_at timestamp with time zone default now()
    );
  `;

  // Attempt to call a custom RPC function (e.g., 'exec_sql')
  const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
  if (error) {
    throw new Error('Failed to create tables via RPC. Please use the Supabase SQL Editor to run the SQL manually.');
  }
  return { success: true };
} 