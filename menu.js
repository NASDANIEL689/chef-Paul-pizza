// Menu Data for Chef Paul Pizza
// Supabase integration for order management

// Supabase Configuration
const SUPABASE_URL = 'https://inajemonfduateakwipa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg4NjYsImV4cCI6MjA2NDk1NDg2Nn0.51lDpvWL4PwELHpv4cVoky8xOzIA0OdJY0mYkSXdus4';

// Global variables for Supabase
let supabaseClient;
let orderFunctions;
const menuItems = [
    {
        id: 1,
        name: "Meat Lovers",
        description: "A hearty pizza loaded with assorted meats and Chef Paul's signature sauce.",
        category: "classic",
        price: {
            largeSmall: 180,
            onTheDouble: 280,
            tripleDecker: 380
        },
        image: "pics/486109780_656386520481154_4888741190451172103_n.jpg",
        dietary: []
    },
    {
        id: 2,
        name: "Mexican Chilli",
        description: "Spicy Mexican-inspired pizza with a kick of chilli and fresh toppings.",
        category: "classic",
        price: {
            largeSmall: 190,
            onTheDouble: 290,
            tripleDecker: 390
        },
        image: "pics/488760799_652433037543169_4459470251648953587_n.jpg",
        dietary: []
    },
    {
        id: 3,
        name: "Creamy Chicken",
        description: "Tender chicken pieces in a creamy sauce with a blend of cheeses.",
        category: "classic",
        price: {
            largeSmall: 200,
            onTheDouble: 300,
            tripleDecker: 400
        },
        image: "pics/497950856_682776077842198_1598299939128618699_n.jpg",
        dietary: []
    },
    {
        id: 4,
        name: "Phane Pizza",
        description: "A unique and delicious pizza with Chef Paul's special Phane recipe.",
        category: "special",
        price: {
            largeSmall: 180,
            onTheDouble: 280,
            tripleDecker: 380
        },
        image: "pics/486109780_656386520481154_4888741190451172103_n.jpg",
        dietary: []
    }
];

// DOM Elements
let menuGrid;
let filterButtons;

// Shopping Cart
let cart = [];

// Initialize the menu
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase client
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Initialize Order Functions
        orderFunctions = {
            async createOrder(orderData) {
                try {
                    const { data, error } = await supabaseClient
                        .from('orders')
                        .insert([{
                            customer_name: orderData.customer_name,
                            customer_phone: orderData.customer_phone,
                            customer_email: orderData.customer_email,
                            delivery_address: orderData.delivery_address,
                            order_type: orderData.order_type,
                            items: orderData.items,
                            total_amount: orderData.total_amount,
                            status: 'pending',
                            created_at: new Date().toISOString()
                        }])
                        .select();

                    if (error) throw error;
                    return data[0];
                } catch (error) {
                    console.error('Error creating order:', error);
                    throw new Error('Failed to create order. Please try again.');
                }
            }
        };
        
        console.log('Supabase initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        // Create a fallback order function
        orderFunctions = {
            async createOrder(orderData) {
                console.log('Order data (fallback):', orderData);
                return { id: Date.now(), status: 'pending' };
            }
        };
    }
    
    // Initialize DOM elements
    menuGrid = document.querySelector('.menu-grid');
    filterButtons = document.querySelectorAll('.filter-btn');
    
    console.log('Menu Grid:', menuGrid);
    console.log('Menu Items:', menuItems);
    console.log('Filter Buttons:', filterButtons);
    
    loadCartFromStorage(); // Load cart from localStorage
    displayMenuItems();
    setupEventListeners();
    updateCartDisplay();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Expose addToCart globally if needed
    window.addToCart = addToCart;
});

function setupEventListeners() {
    // DOM Elements
    const cartBtn = document.querySelector('.cart-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const checkoutBtnNav = document.querySelector('.checkout-btn-nav');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutOverlay = document.querySelector('.checkout-overlay');
    const closeCheckoutBtn = document.querySelector('.close-checkout-btn');
    const checkoutCartItems = document.getElementById('checkout-cart-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const checkoutForm = document.getElementById('checkout-form');
    const deliveryDetails = document.querySelector('.delivery-details');
    const orderTypeRadios = document.getElementsByName('orderType');

    // Filter Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            if (category === 'all') {
                displayMenuItems();
            } else {
                displayMenuItems(menuItems.filter(item => item.category === category));
            }
        });
    });

    // Add to Cart and Size Selection
    menuGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = parseInt(e.target.dataset.id);
            const size = e.target.closest('.menu-item').querySelector('.size-btn.active').dataset.size;
            addToCart(id, size);
        } else if (e.target.classList.contains('size-btn')) {
            // Handle size selection
            const sizeBtns = e.target.parentElement.querySelectorAll('.size-btn');
            sizeBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // Cart Button
    if (cartBtn && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            cartOverlay.classList.toggle('open');
        });
    }
    // Close Cart Button
    if (closeCartBtn && cartOverlay) {
        closeCartBtn.addEventListener('click', () => {
            cartOverlay.classList.remove('open');
        });
    }
    // Clear Cart Button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartDisplay();
            saveCartToStorage(); // Save cart to localStorage
            showCartNotification('Cart cleared');
        });
    }
    // Checkout overlay logic
    if (checkoutBtn && checkoutOverlay) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showCartNotification('Your cart is empty!');
                return;
            }
            populateCheckoutOverlay();
            checkoutOverlay.style.display = 'flex';
            cartOverlay.classList.remove('open');
        });
    }
    if (closeCheckoutBtn && checkoutOverlay) {
        closeCheckoutBtn.addEventListener('click', () => {
            checkoutOverlay.style.display = 'none';
        });
    }
    if (orderTypeRadios && deliveryDetails) {
        Array.from(orderTypeRadios).forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'delivery' && radio.checked) {
                    deliveryDetails.style.display = '';
                } else if (radio.value === 'pickup' && radio.checked) {
                    deliveryDetails.style.display = 'none';
                }
            });
        });
    }
    if (checkoutForm && checkoutOverlay) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = document.querySelector('.confirm-order-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing Order...';
            
            try {
                // Get form data
                const customerName = document.getElementById('customerName').value;
                const customerPhone = document.getElementById('customerPhone').value;
                const customerEmail = document.getElementById('customerEmail')?.value || '';
                const orderType = document.querySelector('input[name="orderType"]:checked').value;
                const deliveryAddress = document.getElementById('deliveryAddress').value;
                const totalAmount = parseFloat(document.getElementById('checkout-total-price').textContent);

                // Validate required fields
                if (!customerName || !customerPhone) {
                    throw new Error('Please fill in all required fields');
                }

                if (orderType === 'delivery' && !deliveryAddress) {
                    throw new Error('Please provide delivery address');
                }

                // Prepare order data for Supabase
                const orderData = {
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    customer_email: customerEmail,
                    delivery_address: orderType === 'delivery' ? deliveryAddress : null,
                    order_type: orderType,
                    items: cart.map(item => ({
                        name: item.name,
                        size: sizeLabel(item.size),
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity
                    })),
                    total_amount: totalAmount,
                    status: 'pending'
                };

                // Submit order to Supabase
                const order = await orderFunctions.createOrder(orderData);
                
                // Show success message with order ID
                alert(`Order placed successfully! Your order ID: ${order.id}\n\nYour order has been sent to Chef Paul Pizza and will be processed shortly.`);
                
                // Clear cart and close checkout
                cart = [];
                updateCartDisplay();
                saveCartToStorage(); // Save cart to localStorage
                document.querySelector('.checkout-overlay').style.display = 'none';
                
            } catch (error) {
                alert('Order failed: ' + error.message);
                console.error('Order error:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Pay & Confirm Order';
            }
        });
    }
    function populateCheckoutOverlay() {
        checkoutCartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'checkout-cart-item';
            div.innerHTML = `<span>${item.name} (${sizeLabel(item.size) || ''}) x${item.quantity}</span> <span>P${item.price * item.quantity}</span>`;
            checkoutCartItems.appendChild(div);
            total += item.price * item.quantity;
        });
        checkoutTotalPrice.textContent = total;
    }
}

// Display Menu Items
function displayMenuItems(items = menuItems) {
    console.log('Displaying menu items:', items);
    console.log('Menu Grid element:', menuGrid);
    
    if (!menuGrid) {
        console.error('Menu grid element not found!');
        return;
    }
    
    menuGrid.innerHTML = '';
    items.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
    
    console.log('Menu items displayed successfully');
}

// Create Menu Item
function createMenuItem(item) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <div class="menu-item-prices">
                <div><strong>Large + Small:</strong> P${item.price.largeSmall}</div>
                <div><strong>On the Double:</strong> P${item.price.onTheDouble}</div>
                <div><strong>Triple Decker:</strong> P${item.price.tripleDecker}</div>
            </div>
            <div class="size-selector">
                <button class="size-btn active" data-size="largeSmall">Large + Small</button>
                <button class="size-btn" data-size="onTheDouble">On the Double</button>
                <button class="size-btn" data-size="tripleDecker">Triple Decker</button>
            </div>
            <p>${item.description}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
        </div>
    `;
    return card;
}

function sizeLabel(size) {
    switch (size) {
        case 'largeSmall': return 'Large + Small';
        case 'onTheDouble': return 'On the Double';
        case 'tripleDecker': return 'Triple Decker';
        default: return size;
    }
}

function addToCart(id, size) {
    const item = menuItems.find(i => i.id === id);
    if (item) {
        const price = item.price[size];
        const cartKey = `${item.name}-${size}`;
        const existingItem = cart.find(i => i.key === cartKey);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ key: cartKey, name: item.name, size, price, quantity: 1 });
        }
        showCartNotification(`${item.name} (${sizeLabel(size)}) added to cart!`);
        updateCartDisplay();
        saveCartToStorage(); // Save cart to localStorage
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-size">${sizeLabel(item.size)}</span>
                <span class="cart-item-price">P${item.price}</span>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn decrease" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-index="${index}">+</button>
                <button class="remove-item-btn" data-index="${index}">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (e.target.classList.contains('increase')) {
                cart[index].quantity += 1;
            } else if (e.target.classList.contains('decrease')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
            }
            updateCartDisplay();
            saveCartToStorage(); // Save cart to localStorage
        });
    });
    cartItems.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
            saveCartToStorage(); // Save cart to storage
        });
    });
    cartTotalPrice.textContent = total;
}

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Cart storage functions
function saveCartToStorage() {
    try {
        localStorage.setItem('chefPaulCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('chefPaulCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
                updateCartDisplay();
            }
        }
    } catch (error) {
        console.error('Error loading cart from storage:', error);
        cart = [];
    }
}

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: var(--white);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    .notification.success {
        background-color: #4CAF50;
    }
    .notification.error {
        background-color: var(--red);
    }
`;
document.head.appendChild(style);

// Hamburger Menu Functionality
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburgerMenu && mobileMenu) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// Add card number formatting
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

// Add expiry date formatting
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0,2) + '/' + value.slice(2,4);
    }
    e.target.value = value;
});

// Add CVV validation
document.getElementById('cvv').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0,3);
    e.target.value = value;
}); 