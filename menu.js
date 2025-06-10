// Menu Data
const menuItems = [
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
        dietary: []
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
        dietary: []
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
        dietary: []
    }
];

// DOM Elements
const menuGrid = document.querySelector('.menu-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Shopping Cart
let cart = [];

// Initialize the menu
document.addEventListener('DOMContentLoaded', () => {
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
    const menuGrid = document.querySelector('.menu-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

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
            submitButton.textContent = 'Processing Payment...';
            
            try {
                // Get form data
                const formData = {
                    cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value,
                    cardName: document.getElementById('cardName').value,
                    amount: document.getElementById('checkout-total-price').textContent,
                    customerName: document.getElementById('customerName').value,
                    customerPhone: document.getElementById('customerPhone').value,
                    orderType: document.querySelector('input[name="orderType"]:checked').value,
                    deliveryAddress: document.getElementById('deliveryAddress').value
                };

                // Here you would typically make an API call to your payment processor
                // For demonstration, we'll simulate a successful payment
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

                // Show success message
                alert('Payment successful! Your order has been placed.');
                
                // Clear cart and close checkout
                clearCart();
                document.querySelector('.checkout-overlay').style.display = 'none';
                
            } catch (error) {
                alert('Payment failed. Please try again.');
                console.error('Payment error:', error);
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
    menuGrid.innerHTML = '';
    items.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
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