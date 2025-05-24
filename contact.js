const contactForm = document.getElementById('contactForm');
const faqItems = document.querySelectorAll('.faq-item');

// Shopping Cart
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateCartDisplay();

    // Expose addToCart globally if needed
    window.addToCart = addToCart;
});

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

    // Contact Form Submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // FAQ Accordion
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleFAQ(item);
        });
    });

    // Order Button
    const orderBtn = document.querySelector('.order-btn');
    orderBtn.addEventListener('click', () => {
        window.location.href = '#menu';
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

function addToCart(pizzaName) {
    // For demo, use a fixed price. In real use, look up the pizza and price.
    const price = 100;
    const existingItem = cart.find(item => item.name === pizzaName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: pizzaName, price, quantity: 1 });
    }
    showCartNotification(pizzaName);
    updateCartDisplay();
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">P${item.price}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    cartTotalPrice.textContent = total;
}

function showCartNotification(pizzaName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${pizzaName} added to cart!`;
    document.body.appendChild(notification);
    // Animate notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // In a real application, you would send this to a backend
    console.log('Form submitted:', formObject);
    
    // Show success message
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Toggle FAQ Item
function toggleFAQ(item) {
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items
    faqItems.forEach(faqItem => {
        faqItem.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
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

    /* FAQ Animation */
    .faq-answer {
        transition: all 0.3s ease;
    }

    .faq-item.active .faq-answer {
        animation: slideDown 0.3s ease forwards;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 