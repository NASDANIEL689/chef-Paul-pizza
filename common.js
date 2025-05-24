// Common functionality for all pages
document.addEventListener('DOMContentLoaded', () => {
    console.log('Common.js loaded');
    
    // Setup hamburger menu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    let isMenuOpen = false;

    if (hamburgerMenu && mobileMenu) {
        console.log('Setting up hamburger menu');
        
        // Toggle menu on hamburger click
        hamburgerMenu.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked');
            
            // Toggle menu state
            isMenuOpen = !isMenuOpen;
            
            // Update classes and styles based on new state
            if (isMenuOpen) {
                hamburgerMenu.classList.add('active');
                mobileMenu.classList.add('active');
                mobileMenu.style.transform = 'translateX(0)';
                document.body.style.overflow = 'hidden';
            } else {
                hamburgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.style.transform = 'translateX(-100%)';
                document.body.style.overflow = '';
            }
            
            // Log menu state
            console.log('Menu state:', {
                isMenuOpen,
                hamburgerActive: hamburgerMenu.classList.contains('active'),
                mobileMenuActive: mobileMenu.classList.contains('active'),
                menuTransform: mobileMenu.style.transform
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && 
                !hamburgerMenu.contains(e.target) && 
                !mobileMenu.contains(e.target)) {
                console.log('Clicking outside, closing menu');
                closeMenu();
            }
        });

        // Close menu when clicking a link or button
        mobileMenu.querySelectorAll('a, button').forEach(element => {
            element.addEventListener('click', () => {
                console.log('Link/button clicked, closing menu');
                closeMenu();
            });
        });

        // Prevent clicks inside mobile menu from closing it
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // Function to close menu
        function closeMenu() {
            isMenuOpen = false;
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenu.style.transform = 'translateX(-100%)';
            document.body.style.overflow = '';
        }
    } else {
        console.log('Hamburger menu elements not found:', { hamburgerMenu, mobileMenu });
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
}); 