import { orderFunctions, authFunctions, subscribeToOrders } from './supabase.js'

// Dashboard functionality
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Dashboard initialized');
    
    // Check authentication
    try {
        const user = await authFunctions.getCurrentUser()
        if (!user) {
            window.location.href = 'login.html'
            return
        }
    } catch (error) {
        console.error('Authentication error:', error)
        window.location.href = 'login.html'
        return
    }
    
    // Initialize dashboard
    await initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start real-time updates
    startRealTimeUpdates();
});

async function initializeDashboard() {
    try {
        // Get initial data
        const [orders, stats] = await Promise.all([
            orderFunctions.getActiveOrders(),
            orderFunctions.getOrderStats()
        ])
        
        // Update statistics
        updateStatistics(stats)
        
        // Populate orders table
        populateOrdersTable(orders)
    } catch (error) {
        console.error('Error initializing dashboard:', error)
        showNotification('Error loading dashboard data', 'error')
    }
}

function updateStatistics(stats) {
    document.getElementById('totalOrders').textContent = stats.totalOrders
    document.getElementById('activeOrders').textContent = stats.activeOrders
    document.getElementById('avgOrderValue').textContent = `P${stats.avgOrderValue.toFixed(2)}`
    
    // Calculate completion rate
    const completionRate = ((stats.totalOrders - stats.activeOrders) / stats.totalOrders) * 100
    document.getElementById('completionRate').textContent = `${completionRate.toFixed(1)}%`
}

function populateOrdersTable(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${formatOrderItems(order.items)}</td>
            <td>P${order.total_amount}</td>
            <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
            <td>${formatTime(order.created_at)}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewOrder('${order.id}')">View</button>
                <button class="action-btn update-btn" onclick="updateOrderStatus('${order.id}')">Update</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        try {
            const orders = await orderFunctions.getActiveOrders();
            const filteredOrders = orders.filter(order => 
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer_name.toLowerCase().includes(searchTerm) ||
                formatOrderItems(order.items).toLowerCase().includes(searchTerm)
            );
            updateOrdersTable(filteredOrders);
        } catch (error) {
            console.error('Error searching orders:', error);
            showNotification('Error searching orders', 'error');
        }
    });
    
    // Status filter
    const statusFilter = document.querySelector('.filter-select');
    statusFilter.addEventListener('change', async (e) => {
        const status = e.target.value;
        try {
            const orders = await orderFunctions.getActiveOrders();
            const filteredOrders = status === 'all' 
                ? orders 
                : orders.filter(order => order.status === status);
            updateOrdersTable(filteredOrders);
        } catch (error) {
            console.error('Error filtering orders:', error);
            showNotification('Error filtering orders', 'error');
        }
    });
    
    // Date range filter
    const dateRange = document.getElementById('dateRange');
    dateRange.addEventListener('change', async (e) => {
        const range = e.target.value;
        try {
            const orders = await orderFunctions.getActiveOrders();
            const filteredOrders = filterOrdersByDate(orders, range);
            updateOrdersTable(filteredOrders);
        } catch (error) {
            console.error('Error filtering by date:', error);
            showNotification('Error filtering by date', 'error');
        }
    });
}

function startRealTimeUpdates() {
    subscribeToOrders(async (payload) => {
        console.log('Real-time update:', payload);
        
        try {
            // Refresh dashboard data
            const [orders, stats] = await Promise.all([
                orderFunctions.getActiveOrders(),
                orderFunctions.getOrderStats()
            ]);
            
            updateStatistics(stats);
            populateOrdersTable(orders);
            
            // Show notification for new orders
            if (payload.eventType === 'INSERT') {
                showNotification(`New order received: ${payload.new.id}`);
            }
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    });
}

async function viewOrder(orderId) {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
            
        if (error) throw error;
        
        // Create and show modal with order details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Order Details - ${order.id}</h2>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customer_name}</p>
                    <p><strong>Phone:</strong> ${order.customer_phone}</p>
                    <p><strong>Email:</strong> ${order.customer_email}</p>
                    <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
                    <p><strong>Items:</strong> ${formatOrderItems(order.items)}</p>
                    <p><strong>Total:</strong> P${order.total_amount}</p>
                    <p><strong>Status:</strong> ${capitalizeFirst(order.status)}</p>
                    <p><strong>Order Time:</strong> ${formatTime(order.created_at)}</p>
                </div>
                <button onclick="this.closest('.modal').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error viewing order:', error);
        showNotification('Error loading order details', 'error');
    }
}

async function updateOrderStatus(orderId) {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();
            
        if (error) throw error;
        
        const statuses = ['pending', 'preparing', 'ready', 'delivered'];
        const currentIndex = statuses.indexOf(order.status);
        const nextStatus = statuses[currentIndex + 1] || statuses[0];
        
        // Update order status
        const updatedOrder = await orderFunctions.updateOrderStatus(orderId, nextStatus);
        
        // Show notification
        showNotification(`Order ${orderId} status updated to ${capitalizeFirst(nextStatus)}`);
        
        // Refresh dashboard
        await initializeDashboard();
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Error updating order status', 'error');
    }
}

// Utility functions
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatOrderItems(items) {
    return items.map(item => `${item.quantity}x ${item.name}`).join(', ');
}

function filterOrdersByDate(orders, range) {
    const now = new Date();
    let startDate;
    
    switch(range) {
        case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        default:
            return orders;
    }
    
    return orders.filter(order => new Date(order.created_at) >= startDate);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add styles for modal and notification
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--orange);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 