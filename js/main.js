// Navbar scroll effect
const mainNav = document.getElementById('mainNav');
function handleNavbarScroll() {
    if (!mainNav) return;
    if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else if (!mainNav.dataset.alwaysScrolled) {
        mainNav.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', handleNavbarScroll);
handleNavbarScroll();

// Contact form handling (Formspree via fetch, with real success/error feedback)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn = contactForm.querySelector('.btn-submit');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (successMessage) successMessage.classList.remove('show');
        if (errorMessage) errorMessage.classList.remove('show');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
        }

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    contactForm.reset();
                    if (successMessage) {
                        successMessage.classList.add('show');
                        setTimeout(() => successMessage.classList.remove('show'), 6000);
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(() => {
                if (errorMessage) {
                    errorMessage.classList.add('show');
                    setTimeout(() => errorMessage.classList.remove('show'), 6000);
                }
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText;
                }
            });
    });
}

// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile menu closes after a link is clicked
const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
const navbarCollapse = document.querySelector('.navbar-collapse');
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Reveal-on-scroll: adds .visible to .reveal elements once they enter the viewport.
// Uses IntersectionObserver instead of a strict "fully visible" rect check, so
// elements taller than the viewport (or sitting near the bottom of the page)
// still reliably reveal instead of staying stuck at opacity: 0.
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
} else {
    // No IntersectionObserver support: just show everything.
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

// Keep the footer copyright year current without needing manual edits.
document.querySelectorAll('.footer-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
});
