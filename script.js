// Shopping Cart
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // Debug logs
    console.log('Script loaded and DOM ready');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    console.log('Hamburger:', hamburgerMenu);
    console.log('Mobile menu:', mobileMenu);

    // DOM Elements
    const orderBtn = document.querySelector('.order-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const clearCartBtn = document.querySelector('.clear-cart-btn');

    setupEventListeners();
    updateCartDisplay();

    // Event Listeners
    function setupEventListeners() {
        // Order Button
        orderBtn.addEventListener('click', () => {
            window.location.href = '#menu';
        });

        // Cart Button
        cartBtn.addEventListener('click', () => {
            cartOverlay.classList.toggle('open');
        });

        // Close Cart Button
        closeCartBtn.addEventListener('click', () => {
            cartOverlay.classList.remove('open');
        });

        // Clear Cart Button
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartDisplay();
            showCartNotification('Cart cleared');
        });
    }

    function addToCart(pizzaName) {
        const existingItem = cart.find(item => item.name === pizzaName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: pizzaName, quantity: 1, price: 100 }); // Assuming price is 100 for now
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

        // Add event listeners for quantity buttons and remove buttons
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
        // Animate notification
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