// Sample reviews data (in a real application, this would come from a backend)
const reviews = [
    {
        id: 1,
        name: "John Smith",
        rating: 5,
        review: "Best pizza I've ever had! The crust is perfectly crispy and the toppings are always fresh.",
        date: "2024-03-15"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        rating: 4,
        review: "Great service and delicious food. The delivery was quick and the pizza was still hot!",
        date: "2024-03-14"
    },
    {
        id: 3,
        name: "Mike Brown",
        rating: 5,
        review: "The family feast deal is amazing value. Perfect for our weekly family dinner.",
        date: "2024-03-13"
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const reviewsContainer = document.getElementById('reviewsContainer');
const ratingButtons = document.querySelectorAll('.rating-btn');
const orderBtn = document.querySelector('.order-btn');
const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const closeCartBtn = document.querySelector('.close-cart-btn');
const clearCartBtn = document.querySelector('.clear-cart-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayReviews();
    setupEventListeners();
    updateCartDisplay();

    // Expose addToCart globally if needed
    window.addToCart = addToCart;
});

// Display Reviews
function displayReviews() {
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });
}

// Create Review Card
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    card.innerHTML = `
        <div class="review-header">
            <span class="reviewer-name">${review.name}</span>
            <span class="review-date">${formatDate(review.date)}</span>
        </div>
        <div class="review-rating">${stars}</div>
        <p class="review-text">${review.review}</p>
    `;
    
    return card;
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Setup Event Listeners
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

    // Rating Buttons
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const rating = parseInt(button.dataset.rating);
            selectRating(rating);
        });
    });
    
    // Form Submission
    feedbackForm.addEventListener('submit', handleFormSubmit);

    // Order Button
    orderBtn.addEventListener('click', () => {
        window.location.href = '#menu';
    });
}

// Select Rating
function selectRating(rating) {
    ratingButtons.forEach(button => {
        const buttonRating = parseInt(button.dataset.rating);
        button.classList.toggle('active', buttonRating <= rating);
    });
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(feedbackForm);
    const selectedRating = document.querySelector('.rating-btn.active')?.dataset.rating;
    
    if (!selectedRating) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    const review = {
        id: reviews.length + 1,
        name: formData.get('name'),
        rating: parseInt(selectedRating),
        review: formData.get('review'),
        date: new Date().toISOString().split('T')[0]
    };
    
    // In a real application, you would send this to a backend
    reviews.unshift(review);
    displayReviews();
    
    // Reset form
    feedbackForm.reset();
    ratingButtons.forEach(button => button.classList.remove('active'));
    
    showNotification('Thank you for your feedback!', 'success');
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
`;
document.head.appendChild(style);

function addToCart(pizzaName) {
    const existingItem = cart.find(item => item.name === pizzaName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: pizzaName, quantity: 1, price: 100 }); // Replace with real price
    }
    showCartNotification(`${pizzaName} added to cart!`);
    updateCartDisplay();
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