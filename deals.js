// Deals Data
const deals = [
    {
        id: 1,
        title: "Family Feast",
        description: "2 Large Pizzas + 2L Soda + Garlic Bread",
        price: 329.99,
        originalPrice: 445.99,
        image: "pics/486109780_656386520481154_4888741190451172103_n.jpg",
        endDate: "2024-04-30T23:59:59",
        terms: "Valid for dine-in and delivery. Cannot be combined with other offers."
    },
    {
        id: 2,
        title: "Lunch Special",
        description: "Medium Pizza + Drink + Side",
        price: 129.99,
        originalPrice: 118.99,
        image: "pics/488760799_652433037543169_4459470251648953587_n.jpg",
        endDate: "2024-04-15T14:00:00",
        terms: "Valid Monday-Friday, 11 AM - 2 PM only."
    },
    {
        id: 3,
        title: "Weekend Party Pack",
        description: "4 Large Pizzas + 2L Soda + 2 Sides",
        price: 499.99,
        originalPrice: 649.99,
        image: "pics/497950856_682776077842198_1598299939128618699_n.jpg",
        endDate: "2024-04-20T23:59:59",
        terms: "Valid Friday-Sunday only. 24-hour advance notice required."
    }
];

// DOM Elements
const dealsGrid = document.querySelector('.deals-grid');

// Shopping Cart
let cart = [];

// Initialize the deals
document.addEventListener('DOMContentLoaded', () => {
    displayDeals();
    startCountdownTimers();
    setupEventListeners();
    updateCartDisplay();

    // Expose addToCart globally if needed
    window.addToCart = addToCart;
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
    const card = document.createElement('div');
    card.className = 'deal-card';
    
    const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
    
    card.innerHTML = `
        <div class="deal-badge">${discount}% OFF</div>
        <img src="${deal.image}" alt="${deal.title}" class="deal-image">
        <div class="deal-content">
            <h3 class="deal-title">${deal.title}</h3>
            <p class="deal-description">${deal.description}</p>
            <div class="deal-price">
                <span class="original-price">P${deal.originalPrice}</span>
                <span class="current-price">P${deal.price}</span>
            </div>
            <div class="deal-timer" data-end="${deal.endDate}">
                <span>Ends in: </span>
                <span class="countdown"></span>
            </div>
            <a href="#" class="deal-button" data-id="${deal.id}">Order Now</a>
            <p class="deal-terms">${deal.terms}</p>
        </div>
    `;
    
    return card;
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
            showCartNotification('Cart cleared');
        });
    }
    // Checkout overlay logic
    if (checkoutBtnNav && checkoutOverlay) {
        checkoutBtnNav.addEventListener('click', () => {
            populateCheckoutOverlay();
            checkoutOverlay.classList.add('open');
        });
    }
    if (checkoutBtn && checkoutOverlay) {
        checkoutBtn.addEventListener('click', () => {
            populateCheckoutOverlay();
            checkoutOverlay.classList.add('open');
        });
    }
    if (closeCheckoutBtn && checkoutOverlay) {
        closeCheckoutBtn.addEventListener('click', () => {
            checkoutOverlay.classList.remove('open');
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
    cartItems.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
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

}); 