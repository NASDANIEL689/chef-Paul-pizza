// Popular Pizzas Data
const popularPizzas = [
    {
        id: 1,
        name: "Meat Lovers",
        description: "A hearty pizza loaded with assorted meats and Chef Paul's signature sauce.",
        category: "classic",
        price: {
            largeSmall: 170,
            onTheDouble: 270,
            tripleDecker: 370
        },
        image: "pics/486109780_656386520481154_4888741190451172103_n.jpg",
        rating: 4.9,
        orders: 1500,
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Mexican Chilli",
        description: "Spicy Mexican-inspired pizza with a kick of chilli and fresh toppings.",
        category: "gourmet",
        price: {
            largeSmall: 180,
            onTheDouble: 280,
            tripleDecker: 380
        },
        image: "pics/488760799_652433037543169_4459470251648953587_n.jpg",
        rating: 4.8,
        orders: 1200,
        badge: "Spicy Favorite"
    },
    {
        id: 3,
        name: "Creamy Chicken",
        description: "Tender chicken pieces in a creamy sauce with a blend of cheeses.",
        category: "gourmet",
        price: {
            largeSmall: 190,
            onTheDouble: 290,
            tripleDecker: 390
        },
        image: "pics/497950856_682776077842198_1598299939128618699_n.jpg",
        rating: 4.7,
        orders: 1100,
        badge: "Customer Favorite"
    }
];

// Customer Reviews Data
const customerReviews = [
    {
        id: 1,
        name: "John Smith",
        rating: 5,
        review: "The Meat Lovers is absolutely amazing! The perfect balance of cheese and meat.",
        date: "2024-02-15"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        rating: 4,
        review: "The Mexican Chilli is my go-to for a spicy treat!",
        date: "2024-02-14"
    },
    {
        id: 3,
        name: "Mike Brown",
        rating: 5,
        review: "Creamy Chicken is so rich and delicious. Highly recommend!",
        date: "2024-02-13"
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const popularGrid = document.querySelector('.popular-grid');
const reviewsContainer = document.getElementById('reviewsContainer');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    displayPopularPizzas();
    displayReviews();
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
});

// Display Popular Pizzas
function displayPopularPizzas(category = 'all') {
    popularGrid.innerHTML = '';
    
    const filteredPizzas = category === 'all' 
        ? popularPizzas 
        : popularPizzas.filter(pizza => pizza.category === category);
    
    filteredPizzas.forEach(pizza => {
        const pizzaCard = createPizzaCard(pizza);
        popularGrid.appendChild(pizzaCard);
    });
}

// Create Pizza Card
function createPizzaCard(pizza) {
    const card = document.createElement('div');
    card.className = 'popular-item';
    
    card.innerHTML = `
        <div class="popular-badge">${pizza.badge}</div>
        <img src="${pizza.image}" alt="${pizza.name}" class="popular-image">
        <div class="popular-content">
            <h3 class="popular-title">${pizza.name}</h3>
            <p class="popular-description">${pizza.description}</p>
            <div class="popular-stats">
                <div class="popular-rating">${'★'.repeat(Math.floor(pizza.rating))}${pizza.rating % 1 ? '½' : ''} (${pizza.rating})</div>
                <div class="popular-orders">${pizza.orders}+ orders</div>
            </div>
            <div class="popular-price">
                <strong>Large + Small:</strong> P${pizza.price.largeSmall}<br>
                <strong>On the Double:</strong> P${pizza.price.onTheDouble}<br>
                <strong>Triple Decker:</strong> P${pizza.price.tripleDecker}
            </div>
            <div class="size-selector">
                <button class="size-btn active" data-size="largeSmall">Large + Small</button>
                <button class="size-btn" data-size="onTheDouble">On the Double</button>
                <button class="size-btn" data-size="tripleDecker">Triple Decker</button>
            </div>
            <button class="add-to-cart-btn" data-pizza-id="${pizza.id}">Add to Cart</button>
        </div>
    `;
    
    return card;
}

// Display Reviews
function displayReviews() {
    reviewsContainer.innerHTML = '';
    
    customerReviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });
}

// Create Review Card
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    card.innerHTML = `
        <div class="review-header">
            <span class="reviewer-name">${review.name}</span>
            <span class="review-date">${formatDate(review.date)}</span>
        </div>
        <div class="review-rating">${'★'.repeat(review.rating)}</div>
        <p class="review-text">${review.review}</p>
    `;
    
    return card;
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup Event Listeners
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

    // Category Filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Filter pizzas
            const category = button.dataset.category;
            displayPopularPizzas(category);
        });
    });

    // Add to Cart and Size Selection
    popularGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const pizzaId = e.target.dataset.pizzaId;
            const size = e.target.closest('.popular-item').querySelector('.size-btn.active').dataset.size;
            addToCart(pizzaId, size);
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
            // Simple confirmation for now
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
            div.innerHTML = `<span>${item.name} (${sizeLabel(item.size) || ''}) x${item.quantity}</span> <span>P${item.price * item.quantity}</span>`;
            checkoutCartItems.appendChild(div);
            total += item.price * item.quantity;
        });
        checkoutTotalPrice.textContent = total;
    }
}

// Add to Cart
function addToCart(pizzaId, size) {
    const pizza = popularPizzas.find(p => p.id === parseInt(pizzaId));
    if (pizza) {
        const price = pizza.price[size];
        const cartKey = `${pizza.name}-${size}`;
        const existingItem = cart.find(item => item.key === cartKey);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ key: cartKey, name: pizza.name, size, price, quantity: 1 });
        }
        showCartNotification(`${pizza.name} (${sizeLabel(size)}) added to cart!`);
        updateCartDisplay();
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

function sizeLabel(size) {
    switch (size) {
        case 'largeSmall': return 'Large + Small';
        case 'onTheDouble': return 'On the Double';
        case 'tripleDecker': return 'Triple Decker';
        default: return size;
    }
} 