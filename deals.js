// Deals Data
// Note: Supabase integration requires a web server to work properly
// For now, we'll use local storage for orders

// NOTE: Avoid using ESM imports here because this script is not loaded as a module.
// If a backend is available, replace this stub with a real implementation.
const dealFunctions = {
    getDeals: async () => {
        throw new Error('Deals backend not configured');
    }
};

const orderFunctions = {
    createOrder: async (_orderData) => {
        throw new Error('Order backend not configured');
    }
};

console.log('Deals.js loaded');

// Deals Data
const deals = [
    {
        id: 1,
        title: "Family Feast Deal",
        description: "2 Large Pizzas + 1 Medium Pizza + 2L Soda + Garlic Bread",
        price: 299,
        originalPrice: 399,
        image: "pics/500642364_687730764013396_5545638874431695074_n (3).jpg",
        badge: "Best Value",
        expiryDate: "2024-04-30",
        terms: "Valid for dine-in and delivery. Not valid with other offers."
    },
    {
        id: 2,
        title: "Weekend Special",
        description: "Buy 1 Large Pizza, Get 1 Medium Pizza Free + Free Delivery",
        price: 199,
        originalPrice: 299,
        image: "pics/497950856_682776077842198_1598299939128618699_n.jpg",
        badge: "Weekend Only",
        expiryDate: "2024-04-28",
        terms: "Valid only on weekends. Delivery within 5km radius."
    },
    {
        id: 3,
        title: "Student Discount",
        description: "20% off on all pizzas with valid student ID",
        price: null,
        originalPrice: null,
        image: "pics/ivan-torres-MQUqbmszGGM-unsplash.jpg",
        badge: "Student Special",
        expiryDate: "2024-12-31",
        terms: "Must present valid student ID. Not valid with other offers."
    },
    {
        id: 4,
        title: "Lunch Rush Special",
        description: "Any Medium Pizza + Soft Drink + Garlic Bread",
        price: 129,
        originalPrice: 189,
        image: "pics/496452071_684132747706531_9034893973497367974_n.jpg",
        badge: "Lunch Time",
        expiryDate: "2024-12-31",
        terms: "Valid Monday-Friday 11AM-3PM only."
    },
    {
        id: 5,
        title: "Triple Decker Deal",
        description: "3 Large Pizzas of your choice + 2L Soda + 2 Garlic Breads",
        price: 399,
        originalPrice: 549,
        image: "pics/486109780_656386520481154_4888741190451172103_n.jpg",
        badge: "Party Pack",
        expiryDate: "2024-05-15",
        terms: "Perfect for parties and gatherings. 24-hour advance notice required."
    },
    {
        id: 6,
        title: "Vegetarian Bundle",
        description: "2 Large Veggie Pizzas + Garden Salad + 1L Juice",
        price: 249,
        originalPrice: 329,
        image: "pics/496452071_684132747706531_9034893973497367974_n.jpg",
        badge: "Veggie Special",
        expiryDate: "2024-06-30",
        terms: "Valid on all vegetarian pizzas. Fresh ingredients guaranteed."
    },
    {
        id: 7,
        title: "Late Night Special",
        description: "Any Large Pizza + 2 Toppings + Free Delivery",
        price: 159,
        originalPrice: 219,
        image: "pics/488760799_652433037543169_4459470251648953587_n.jpg",
        badge: "Late Night",
        expiryDate: "2024-12-31",
        terms: "Valid 9PM-11PM daily. Delivery within 3km radius."
    },
    {
        id: 8,
        title: "First Order Discount",
        description: "50% off your first order when you order online",
        price: null,
        originalPrice: null,
        image: "pics/ivan-torres-MQUqbmszGGM-unsplash.jpg",
        badge: "New Customer",
        expiryDate: "2024-12-31",
        terms: "First-time customers only. Use code: FIRST50 at checkout."
    },
    {
        id: 9,
        title: "Birthday Special",
        description: "Free Large Pizza on your birthday + 20% off entire order",
        price: null,
        originalPrice: null,
        image: "pics/497950856_682776077842198_1598299939128618699_n.jpg",
        badge: "Birthday",
        expiryDate: "2024-12-31",
        terms: "Valid on your birthday only. Must show valid ID."
    },
    {
        id: 10,
        title: "Corporate Lunch",
        description: "10 Large Pizzas + 5 Garlic Breads + 5L Soda",
        price: 899,
        originalPrice: 1299,
        image: "pics/500642364_687730764013396_5545638874431695074_n (3).jpg",
        badge: "Corporate",
        expiryDate: "2024-12-31",
        terms: "For office orders. 48-hour advance notice required."
    }
];

// DOM Elements
const dealsGrid = document.querySelector('.deals-grid');

// Cart array
let cart = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing deals page');
    
    const dealsGrid = document.querySelector('.deals-grid');
    console.log('Found deals grid:', dealsGrid);
    
    if (dealsGrid) {
        try {
            // Clear existing content
            dealsGrid.innerHTML = '';
            
            // Use local deals array
            console.log('Using local deals:', deals);
            
            // Populate deals
            deals.forEach(deal => {
                const dealCard = createDealCard(deal);
                dealsGrid.appendChild(dealCard);
            });
            console.log('Deals populated');
        } catch (error) {
            console.error('Error loading deals:', error);
            dealsGrid.innerHTML = '<p class="error-message">Error loading deals. Please try again later.</p>';
        }
    } else {
        console.error('Deals grid not found!');
    }

    // Setup cart functionality
    setupCart();
    console.log('Cart setup complete');

    // Setup hamburger menu
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
});

// Display Deals
function displayDeals() {
    dealsGrid.innerHTML = '';
    
    deals.forEach(deal => {
        const dealCard = createDealCard(deal);
        dealsGrid.appendChild(dealCard);
    });
}

// Create Deal Card
function createDealCard(deal) {
    console.log('Creating deal card for:', deal.title);
    const card = document.createElement('div');
    card.className = 'deal-card';
    
    const timeLeft = getTimeLeft(deal.expiryDate);
    
    card.innerHTML = `
        <div class="deal-badge">${deal.badge}</div>
        <img src="${deal.image}" alt="${deal.title}" class="deal-image">
        <div class="deal-content">
            <h3 class="deal-title">${deal.title}</h3>
            <p class="deal-description">${deal.description}</p>
            ${deal.price ? `
            <div class="deal-price">
                <span class="original-price">P${deal.originalPrice}</span>
                <span class="current-price">P${deal.price}</span>
            </div>
            ` : `
                <div class="deal-price">
                    <span class="current-price">Special Offer</span>
                </div>
            `}
            <div class="deal-timer">
                <span>Time Left: ${timeLeft}</span>
            </div>
            <button class="deal-button" onclick="addToCart('${deal.title}', ${deal.price || 0})">
                Add to Cart
            </button>
            <p class="deal-terms">${deal.terms}</p>
        </div>
    `;
    
    return card;
}

function getTimeLeft(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
}

// Start Countdown Timers
function startCountdownTimers() {
    const timers = document.querySelectorAll('.deal-timer');
    
    timers.forEach(timer => {
        const endDate = new Date(timer.dataset.end).getTime();
        
        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate - now;
            
            if (distance < 0) {
                clearInterval(countdown);
                timer.innerHTML = '<span>Offer Expired</span>';
                timer.closest('.deal-card').style.opacity = '0.7';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            timer.querySelector('.countdown').textContent = 
                `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });
}

// Event Listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('deal-button')) {
        const dealId = parseInt(e.target.dataset.id);
        const deal = deals.find(d => d.id === dealId);
        
        if (deal) {
            // Add to cart or redirect to order page
            addDealToCart(deal);
        }
    }
});

// Add Deal to Cart
function addDealToCart(deal) {
    const cartKey = `deal-${deal.id}`;
    const existingItem = cart.find(item => item.key === cartKey);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ key: cartKey, name: deal.title, price: deal.price, quantity: 1 });
    }
    showCartNotification(`${deal.title} added to cart!`);
    updateCartDisplay();
}

// Show Deal Notification
function showDealNotification(deal) {
    const notification = document.createElement('div');
    notification.className = 'deal-notification';
    notification.textContent = `${deal.title} added to cart!`;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Add styles for deal notification
const style = document.createElement('style');
style.textContent = `
    .deal-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--orange);
        color: var(--white);
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s ease;
    }

    .original-price {
        text-decoration: line-through;
        color: var(--dark-gray);
        margin-right: 1rem;
    }

    .current-price {
        color: var(--red);
    }
`;
document.head.appendChild(style);

// Event Listeners
function setupEventListeners() {
    // DOM Elements
    const cartBtn = document.querySelector('.cart-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
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

    // Cart Button
    if (cartBtn && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            cartOverlay.style.display = 'block';
            cartOverlay.classList.add('open');
        });
    }
    // Close Cart Button
    if (closeCartBtn && cartOverlay) {
        closeCartBtn.addEventListener('click', () => {
            cartOverlay.classList.remove('open');
            cartOverlay.style.display = 'none';
        });
    }
    // Clear Cart Button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartDisplay();
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
            cartOverlay.style.display = 'none';
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
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your order! We have received your details.');
            checkoutOverlay.classList.remove('open');
            cart.length = 0;
            updateCartDisplay();
        });
    }
    function populateCheckoutOverlay() {
        checkoutCartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'checkout-cart-item';
            div.innerHTML = `<span>${item.name} x${item.quantity}</span> <span>P${item.price * item.quantity}</span>`;
            checkoutCartItems.appendChild(div);
            total += item.price * item.quantity;
        });
        checkoutTotalPrice.textContent = total;
    }
}

function updateCartDisplay() {
    console.log('Updating cart display');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItems || !cartTotalPrice) {
        console.error('Cart elements not found!');
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
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
    
    cartTotalPrice.textContent = total;

    // Add event listeners for quantity buttons
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
        });
    });

    // Add event listeners for remove buttons
    cartItems.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
        });
    });
}

function showCartNotification(message) {
    console.log('Showing notification:', message);
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

// Hamburger Menu Functionality
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

// Make addToCart available globally
window.addToCart = function(dealName, price) {
    console.log('Adding to cart:', dealName, price);
    const existingItem = cart.find(item => item.name === dealName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: dealName, quantity: 1, price: price });
    }
    showCartNotification(`${dealName} added to cart!`);
    updateCartDisplay();
};

function setupCart() {
    console.log('Setting up cart');
    const cartBtn = document.querySelector('.cart-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutBtnNav = document.querySelector('.checkout-btn-nav');
    
    console.log('Cart elements:', {
        cartBtn,
        cartOverlay,
        closeCartBtn,
        clearCartBtn,
        checkoutBtn,
        checkoutBtnNav
    });
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            console.log('Cart button clicked');
            cartOverlay.classList.toggle('open');
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            console.log('Close cart button clicked');
            cartOverlay.classList.remove('open');
        });
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            console.log('Clear cart button clicked');
            cart = [];
            updateCartDisplay();
            showCartNotification('Cart cleared');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log('Checkout button clicked');
            if (cart.length === 0) {
                showCartNotification('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
    
    if (checkoutBtnNav) {
        checkoutBtnNav.addEventListener('click', () => {
            console.log('Checkout nav button clicked');
            if (cart.length === 0) {
                showCartNotification('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

// Enhanced checkout form submission
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = document.querySelector('.confirm-order-btn');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing Order...';
            }
            
            try {
                // Get form data
                const customerName = document.getElementById('customerName')?.value;
                const customerPhone = document.getElementById('customerPhone')?.value;
                const customerEmail = document.getElementById('customerEmail')?.value || '';
                const orderType = document.querySelector('input[name="orderType"]:checked')?.value;
                const deliveryAddress = document.getElementById('deliveryAddress')?.value;
                const totalAmount = parseFloat(document.getElementById('checkout-total-price')?.textContent || '0');

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
                    items: cart.map(item => ({
                        name: item.name,
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
                const checkoutOverlay = document.querySelector('.checkout-overlay');
                if (checkoutOverlay) {
                    checkoutOverlay.style.display = 'none';
                }
                
            } catch (error) {
                alert('Order failed: ' + error.message);
                console.error('Order error:', error);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Pay & Confirm Order';
                }
            }
        });
    }
}

// Initialize checkout form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupCheckoutForm();
}); 