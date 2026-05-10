// ===== CONFIG =====
// After deploying to Render, replace this with your actual Render URL:
// e.g. https://lumiere-bracelet-api.onrender.com
const API_URL = 'https://YOUR-APP-NAME.onrender.com';

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');

function updateCartCount() {
    cartCount.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart — tracks order in DB then opens WhatsApp
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();

        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;

        // Optimistic UI update
        this.textContent = '⏳ Processing...';
        this.disabled = true;

        try {
            // Send order to backend — it returns a WhatsApp URL with order ID
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName, productPrice })
            });

            const data = await response.json();

            if (data.success && data.whatsappUrl) {
                // Add to local cart
                cart.push({ id: data.orderId, name: productName, price: productPrice });
                updateCartCount();

                // Open WhatsApp with pre-filled message including order ID
                window.open(data.whatsappUrl, '_blank');

                this.textContent = '✓ Opening WhatsApp...';
                this.style.background = '#25D366';
            } else {
                throw new Error(data.error || 'Failed to process order');
            }
        } catch (err) {
            console.error('Order error:', err);
            // Fallback — open WhatsApp directly if backend is down
            const message = `Hello Lumiere Bracelet! I'm interested in: ${productName} - ${productPrice}`;
            window.open(`https://wa.me/212619079295?text=${encodeURIComponent(message)}`, '_blank');
            this.textContent = '✓ Opening WhatsApp...';
            this.style.background = '#25D366';
        }

        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = '';
            this.disabled = false;
        }, 2500);
    });
});

updateCartCount();

// ===== FILTER BUTTONS =====
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== CONTACT FORM — sends via backend API =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = this.querySelector('input[placeholder="Your Name"]').value.trim();
        const email = this.querySelector('input[placeholder="Your Email"]').value.trim();
        const message = this.querySelector('textarea').value.trim();

        if (!name || !email || !message) {
            showFormStatus(this, 'Please fill in all fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus(this, 'Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = '⏳ Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (data.success) {
                showFormStatus(this, '✓ Message sent! We\'ll reply soon.', 'success');
                this.reset();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            showFormStatus(this, '❌ Failed to send. Please try WhatsApp instead.', 'error');
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });
}

function showFormStatus(form, message, type) {
    let statusEl = form.querySelector('.form-status');
    if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.className = 'form-status';
        form.appendChild(statusEl);
    }
    statusEl.textContent = message;
    statusEl.style.color = type === 'success' ? '#27ae60' : '#e74c3c';
    statusEl.style.fontWeight = '600';
    statusEl.style.marginTop = '0.5rem';
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 5000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function () {
    navbar.style.boxShadow = window.pageYOffset > 100
        ? '0 2px 20px rgba(0, 0, 0, 0.15)'
        : '0 2px 10px rgba(0, 0, 0, 0.1)';
});

// ===== FEATURE CARDS ANIMATION =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== CART ICON CLICK =====
cartIcon.addEventListener('click', function () {
    window.open(`https://wa.me/212619079295?text=${encodeURIComponent('Hello Lumiere Bracelet! I would like to review my cart.')}`, '_blank');
});

// ===== ACTIVE NAV ON SCROLL =====
window.addEventListener('scroll', function () {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        if (pageYOffset >= section.offsetTop - 200) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
    });
});

console.log('%c✨ Lumiere Bracelet', 'font-size: 24px; color: #d4af37;');
