// Chef Paul Pizza - Order Management Dashboard
// Supabase Configuration
const SUPABASE_URL = 'https://inajemonfduateakwipa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg4NjYsImV4cCI6MjA2NDk1NDg2Nn0.51lDpvWL4PwELHpv4cVoky8xOzIA0OdJY0mYkSXdus4';

// Initialize Supabase client
let supabaseClient;

// Dashboard state
let orders = [];
let currentFilter = 'all';

// DOM Elements
const ordersList = document.getElementById('ordersList');
const filterButtons = document.querySelectorAll('.filter-btn');
const refreshBtn = document.getElementById('refreshBtn');
const testBtn = document.getElementById('testBtn');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase client
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Dashboard: Supabase initialized successfully');
    } catch (error) {
        console.error('Dashboard: Failed to initialize Supabase:', error);
        showError('Failed to connect to database. Please refresh the page.');
        return;
    }
    
    loadOrders();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            displayOrders();
        });
    });

    // Refresh button
    refreshBtn.addEventListener('click', loadOrders);
    
    // Test button
    if (testBtn) {
        testBtn.addEventListener('click', testConnection);
    }
}

// Test Supabase connection
async function testConnection() {
    try {
        console.log('Dashboard: Testing Supabase connection...');
        console.log('Dashboard: Supabase URL:', SUPABASE_URL);
        console.log('Dashboard: Supabase Client:', supabaseClient);
        
        if (!supabaseClient) {
            showError('Supabase client not initialized');
            return;
        }
        
        // Try to query the orders table
        const { data, error } = await supabaseClient
            .from('orders')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('Dashboard: Connection test failed:', error);
            showError('Connection test failed: ' + error.message);
        } else {
            console.log('Dashboard: Connection test successful');
            showSuccess('Database connection successful!');
        }
        
    } catch (error) {
        console.error('Dashboard: Connection test error:', error);
        showError('Connection test error: ' + error.message);
    }
}

// Load orders from Supabase
async function loadOrders() {
    try {
        refreshBtn.disabled = true;
        refreshBtn.textContent = '🔄 Loading...';

        console.log('Dashboard: Attempting to load orders from Supabase...');
        
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Dashboard: Supabase error:', error);
            throw error;
        }

        console.log('Dashboard: Orders loaded successfully:', data);
        orders = data || [];
        
        // If no orders found, show a helpful message
        if (orders.length === 0) {
            console.log('Dashboard: No orders found in database');
            showSuccess('No orders found. Try placing an order from the menu page!');
        } else {
            console.log('Dashboard: Found', orders.length, 'orders');
        }
        
        updateStatistics();
        displayOrders();

    } catch (error) {
        console.error('Dashboard: Error loading orders:', error);
        showError('Failed to load orders: ' + error.message);
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 Refresh Orders';
    }
}

// Display orders based on current filter
function displayOrders() {
    console.log('Dashboard: Displaying orders. Total orders:', orders.length);
    console.log('Dashboard: Current filter:', currentFilter);
    
    const filteredOrders = currentFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === currentFilter);

    console.log('Dashboard: Filtered orders:', filteredOrders);

    ordersList.innerHTML = '';

    if (filteredOrders.length === 0) {
        console.log('Dashboard: No orders to display');
        ordersList.innerHTML = `
            <div class="no-orders">
                <h3>No orders found</h3>
                <p>${currentFilter === 'all' ? 'No orders have been placed yet.' : `No ${currentFilter} orders.`}</p>
            </div>
        `;
        return;
    }

    console.log('Dashboard: Creating order cards for', filteredOrders.length, 'orders');
    filteredOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });
}

// Create order card element
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const orderTime = new Date(order.created_at).toLocaleTimeString();
    const orderDate = new Date(order.created_at).toLocaleDateString();
    
    card.innerHTML = `
        <div class="order-header">
            <span class="order-id">Order #${order.id}</span>
            <span class="order-status ${order.status}">${order.status}</span>
        </div>
        <div class="order-body">
            <div class="customer-info">
                <h4>👤 ${order.customer_name}</h4>
                <p>📞 ${order.customer_phone}</p>
                ${order.customer_email ? `<p>📧 ${order.customer_email}</p>` : ''}
                <p>🕒 ${orderDate} at ${orderTime}</p>
                <p>🚚 ${order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                ${order.delivery_address ? `<p>📍 ${order.delivery_address}</p>` : ''}
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-size">${item.size}</div>
                        </div>
                        <div class="item-price">P${item.total}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="order-footer">
            <div class="order-total">Total: P${order.total_amount}</div>
            <div class="order-actions">
                ${getActionButtons(order)}
            </div>
        </div>
    `;

    // Add event listeners to action buttons
    const actionBtns = card.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleOrderAction(order.id, btn.dataset.action);
        });
    });

    return card;
}

// Get action buttons based on order status
function getActionButtons(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="action-btn primary" data-action="start">Start Processing</button>
            `;
        case 'processing':
            return `
                <button class="action-btn success" data-action="ready">Mark Ready</button>
            `;
        case 'ready':
            return `
                <button class="action-btn success" data-action="complete">Mark Complete</button>
            `;
        case 'completed':
            return `
                <span class="completed-text">✅ Completed</span>
            `;
        default:
            return '';
    }
}

// Handle order actions
async function handleOrderAction(orderId, action) {
    try {
        let newStatus;
        
        switch (action) {
            case 'start':
                newStatus = 'processing';
                break;
            case 'ready':
                newStatus = 'ready';
                break;
            case 'complete':
                newStatus = 'completed';
                break;
            default:
                return;
        }

        // Update order status in Supabase
        const { data, error } = await supabaseClient
            .from('orders')
            .update({ 
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .select();

        if (error) throw error;

        // Update local orders array
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex] = data[0];
        }

        // Refresh display
        updateStatistics();
        displayOrders();

        // Show success message
        showSuccess(`Order #${orderId} status updated to ${newStatus}`);

    } catch (error) {
        console.error('Error updating order:', error);
        showError('Failed to update order status. Please try again.');
    }
}

// Update statistics
function updateStatistics() {
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('processingOrders').textContent = orders.filter(o => o.status === 'processing').length;
    document.getElementById('completedOrders').textContent = orders.filter(o => o.status === 'completed').length;
}

// Utility functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}