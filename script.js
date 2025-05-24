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
    const orderBtn = document.querySelector('.primary-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutBtnNav = document.querySelector('.checkout-btn-nav');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const clearCartBtn = document.querySelector('.clear-cart-btn');

    setupEventListeners();
    updateCartDisplay();
    setupFAQ();

    // Event Listeners
    function setupEventListeners() {
        // Order Button
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                window.location.href = 'menu.html';
            });
        }

        // Cart Button
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartOverlay.classList.toggle('open');
            });
        }

        // Checkout Buttons
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    showCartNotification('Your cart is empty!');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }

        if (checkoutBtnNav) {
            checkoutBtnNav.addEventListener('click', () => {
                if (cart.length === 0) {
                    showCartNotification('Your cart is empty!');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }

        // Close Cart Button
        if (closeCartBtn) {
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

        // Footer Links
        document.querySelectorAll('.footer-section a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });

        // Hamburger Menu
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

    // FAQ Functionality
    function setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const answer = otherItem.querySelector('.faq-answer');
                        answer.style.display = 'none';
                    }
                });

                // Toggle current FAQ item
                item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                
                if (item.classList.contains('active')) {
                    answer.style.display = 'block';
                    answer.style.animation = 'slideDown 0.3s ease forwards';
                } else {
                    answer.style.display = 'none';
                }
            });
        });
    }
}); 