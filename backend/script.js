// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');

// Update cart count display
function updateCartCount() {
    cartCount.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart button handlers
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        const product = {
            id: Date.now(),
            name: productName,
            price: productPrice
        };
        
        cart.push(product);
        updateCartCount();
        
        // Open WhatsApp to contact
        const message = `Hello Lumiere bracelet, I'm interested in: ${productName} - ${productPrice}`;
        window.open(`https://wa.me/212619079295?text=${encodeURIComponent(message)}`, '_blank');
        
        // Show confirmation
        const originalText = this.textContent;
        this.textContent = '✓ Contacting...';
        this.style.background = '#25D366';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 2000);
    });
});

// Initialize cart count on page load
updateCartCount();

// ===== FILTER FUNCTIONALITY =====
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        console.log('Filtering by:', filter);
        // Add filter logic here for full product catalog
    });
});

// ===== CONTACT FORM =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = this.querySelector('input[placeholder="Your Name"]').value;
        const email = this.querySelector('input[placeholder="Your Email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Validate form
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show success message
        const originalButton = this.querySelector('button');
        originalButton.textContent = '✓ Message Sent Successfully!';
        originalButton.style.background = '#27ae60';
        
        // Reset form
        this.reset();
        
        // Restore button
        setTimeout(() => {
            originalButton.textContent = 'Send Message';
            originalButton.style.background = '';
        }, 3000);
    });
}

// ===== SMOOTH SCROLL ENHANCEMENT =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===== PRODUCT HOVER EFFECTS =====
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===== FEATURE CARDS ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== CART ICON CLICK =====
cartIcon.addEventListener('click', function() {
    // Redirect to WhatsApp
    window.open('https://wa.me/212619079295?text=Hello%20Lumiere%20Bracelt%2C%20I%20would%20like%20to%20know%20more%20about%20your%20bracelets', '_blank');
});

// ===== ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== PAGE LOAD ANIMATIONS =====
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// ===== CONSOLE GREETING =====
console.log('%c✨ Welcome to Lumiere bracelet! %c', 'font-size: 24px; color: #d4af37;', 'font-size: 14px;');
console.log('%cPremium Bracelets Collection', 'font-size: 14px; color: #2c3e50;');
