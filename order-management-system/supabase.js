import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://inajemonfduateakwipa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODg2NiwiZXhwIjoyMDY0OTU0ODY2fQ.mO8zpQww9-qHEhtpcwVlrSNsFEN_Ts4tvif_a-AImF8'

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

// Create public client with anon key for client-side operations
const supabasePublic = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg4NjYsImV4cCI6MjA2NDk1NDg2Nn0.51lDpvWL4PwELHpv4cVoky8xOzIA0OdJY0mYkSXdus4')

// Database Tables Structure:
/*
1. orders
   - id (uuid, primary key)
   - customer_name (text)
   - customer_phone (text)
   - customer_email (text)
   - delivery_address (text)
   - items (jsonb)
   - total_amount (numeric)
   - status (text)
   - created_at (timestamp)
   - updated_at (timestamp)

2. order_items
   - id (uuid, primary key)
   - order_id (uuid, foreign key)
   - item_name (text)
   - quantity (integer)
   - price (numeric)
   - special_instructions (text)

3. users (for dashboard access)
   - id (uuid, primary key)
   - email (text, unique)
   - password_hash (text)
   - role (text)
   - created_at (timestamp)

4. deals
   - id (uuid, primary key)
   - title (text)
   - description (text)
   - price (numeric)
   - original_price (numeric)
   - discount_percentage (integer)
   - image (text)
   - badge (text)
   - expiry_date (timestamp)
   - terms (text)
   - created_at (timestamp)
   - updated_at (timestamp)
*/

// Admin Functions
export const adminFunctions = {
    // Initialize database tables
    async initializeDatabase() {
        try {
            // Create deals table
            await supabaseAdmin.rpc('create_deals_table')
            
            // Create orders table
            await supabaseAdmin.rpc('create_orders_table')
            
            // Create users table
            await supabaseAdmin.rpc('create_users_table')
            
            return { success: true }
        } catch (error) {
            console.error('Database initialization error:', error)
            return { success: false, error }
        }
    },

    // Add initial deals
    async addInitialDeals() {
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

        try {
            const { data, error } = await supabaseAdmin
                .from('deals')
                .insert(initialDeals)
                .select()

            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error adding initial deals:', error)
            return { success: false, error }
        }
    }
}

// Order Management Functions
export const orderFunctions = {
    // Create new order
    async createOrder(orderData) {
        const { data, error } = await supabasePublic
            .from('orders')
            .insert([orderData])
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Get all orders
    async getAllOrders() {
        const { data, error } = await supabasePublic
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Get active orders
    async getActiveOrders() {
        const { data, error } = await supabasePublic
            .from('orders')
            .select('*')
            .in('status', ['pending', 'preparing', 'ready'])
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Update order status
    async updateOrderStatus(orderId, newStatus) {
        const { data, error } = await supabasePublic
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Get order statistics
    async getOrderStats() {
        const { data: totalOrders, error: totalError } = await supabasePublic
            .from('orders')
            .select('id', { count: 'exact' })
        
        const { data: activeOrders, error: activeError } = await supabasePublic
            .from('orders')
            .select('id', { count: 'exact' })
            .in('status', ['pending', 'preparing', 'ready'])
        
        const { data: avgOrderValue, error: avgError } = await supabasePublic
            .from('orders')
            .select('total_amount')
        
        if (totalError || activeError || avgError) throw new Error('Error fetching statistics')
        
        const avgValue = avgOrderValue.reduce((sum, order) => sum + order.total_amount, 0) / avgOrderValue.length
        
        return {
            totalOrders: totalOrders.length,
            activeOrders: activeOrders.length,
            avgOrderValue: avgValue
        }
    }
}

// Deal Management Functions
export const dealFunctions = {
    // Get all active deals
    async getActiveDeals() {
        const { data, error } = await supabasePublic
            .from('deals')
            .select('*')
            .gte('expiry_date', new Date().toISOString())
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Create new deal (admin only)
    async createDeal(dealData) {
        const { data, error } = await supabaseAdmin
            .from('deals')
            .insert([dealData])
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Update deal (admin only)
    async updateDeal(dealId, dealData) {
        const { data, error } = await supabaseAdmin
            .from('deals')
            .update(dealData)
            .eq('id', dealId)
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Delete deal (admin only)
    async deleteDeal(dealId) {
        const { error } = await supabaseAdmin
            .from('deals')
            .delete()
            .eq('id', dealId)
        
        if (error) throw error
    }
}

// Authentication Functions
export const authFunctions = {
    // Sign in
    async signIn(email, password) {
        const { data, error } = await supabasePublic.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        return data
    },

    // Sign out
    async signOut() {
        const { error } = await supabasePublic.auth.signOut()
        if (error) throw error
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabasePublic.auth.getUser()
        if (error) throw error
        return user
    }
}

// Real-time subscription
export const subscribeToOrders = (callback) => {
    return supabasePublic
        .channel('orders')
        .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'orders' 
            }, 
            callback
        )
        .subscribe()
}

export { supabasePublic as supabase } 