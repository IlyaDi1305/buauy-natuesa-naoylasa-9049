// ===================================
// Utility Functions
// ===================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===================================
// Mobile Menu Toggle
// ===================================

class MobileMenu {
    constructor() {
        this.toggle = $('#mobileToggle');
        this.menu = $('#navMenu');
        this.links = $$('.nav-link');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// Smooth Scroll
// ===================================

class SmoothScroll {
    constructor() {
        this.links = $$('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = $(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Header Scroll Effect
// ===================================

class HeaderScroll {
    constructor() {
        this.header = $('#header');
        this.init();
    }

    init() {
        if (!this.header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', debounce(handleScroll, 10));
    }
}

// ===================================
// Scroll Animations
// ===================================

class ScrollAnimations {
    constructor() {
        this.elements = $$('.animate-on-scroll');
        this.init();
    }

    init() {
        if (!this.elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===================================
// Tabs System
// ===================================

class TabsManager {
    constructor() {
        this.tabButtons = $$('.tab-btn');
        this.tabPanels = $$('.tab-panel');
        this.init();
    }

    init() {
        if (!this.tabButtons.length) return;

        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, button);
            });
        });
    }

    switchTab(targetTab, clickedButton) {
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        this.tabPanels.forEach(panel => {
            if (panel.id === targetTab) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
}

// ===================================
// Form Validation
// ===================================

class FormValidator {
    constructor() {
        this.form = $('#contactForm');
        this.successMessage = $('#formSuccess');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value) || field.value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
        }

        if (field.name === 'name' && field.value) {
            if (field.value.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            }
        }

        if (isValid) {
            formGroup.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
        } else {
            formGroup.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    clearError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        formGroup.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    handleSubmit() {
        if (this.validateForm()) {
            this.submitForm();
        } else {
            this.scrollToFirstError();
        }
    }

    scrollToFirstError() {
        const firstError = this.form.querySelector('.form-group.error');
        if (firstError) {
            const headerOffset = 100;
            const elementPosition = firstError.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        console.log('Form submitted with data:', data);

        this.showSuccessMessage();
        this.form.reset();

        setTimeout(() => {
            this.hideSuccessMessage();
        }, 5000);
    }

    showSuccessMessage() {
        if (this.successMessage) {
            this.successMessage.classList.add('show');
        }
    }

    hideSuccessMessage() {
        if (this.successMessage) {
            this.successMessage.classList.remove('show');
        }
    }
}

// ===================================
// Gallery Lightbox Effect
// ===================================

class Gallery {
    constructor() {
        this.items = $$('.gallery-item');
        this.init();
    }

    init() {
        if (!this.items.length) return;

        this.items.forEach(item => {
            item.addEventListener('click', () => {
                this.animateItem(item);
            });
        });
    }

    animateItem(item) {
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    }
}

// ===================================
// Active Navigation Link
// ===================================

class ActiveNavigation {
    constructor() {
        this.sections = $$('section[id]');
        this.navLinks = $$('.nav-link');
        this.init();
    }

    init() {
        if (!this.sections.length || !this.navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.style.color = '#d4a5a5';
            } else {
                link.style.color = '';
            }
        });
    }
}

// ===================================
// Parallax Effect for Hero
// ===================================

class ParallaxHero {
    constructor() {
        this.hero = $('.hero');
        this.init();
    }

    init() {
        if (!this.hero) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const limit = this.hero.offsetHeight;

            if (scrolled <= limit) {
                this.hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                this.hero.style.opacity = 1 - (scrolled / limit) * 0.5;
            }
        };

        window.addEventListener('scroll', debounce(handleScroll, 10));
    }
}

// ===================================
// Service Cards Hover Effect
// ===================================

class ServiceCards {
    constructor() {
        this.cards = $$('.service-card');
        this.init();
    }

    init() {
        if (!this.cards.length) return;

        this.cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                this.cards.forEach((c, i) => {
                    if (c !== card) {
                        c.style.opacity = '0.7';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                this.cards.forEach((c) => {
                    c.style.opacity = '1';
                });
            });
        });
    }
}

// ===================================
// Reviews Animation
// ===================================

class ReviewsAnimation {
    constructor() {
        this.reviews = $$('.review-card');
        this.init();
    }

    init() {
        if (!this.reviews.length) return;

        this.reviews.forEach((review, index) => {
            review.style.setProperty('--delay', `${index * 0.1}s`);
        });
    }
}

// ===================================
// Lazy Loading Optimization
// ===================================

class LazyLoader {
    constructor() {
        this.images = $$('img[data-src]');
        this.init();
    }

    init() {
        if (!this.images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// Performance Optimization
// ===================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadResources();
            });
        } else {
            setTimeout(() => this.preloadResources(), 1000);
        }
    }

    preloadResources() {
        const links = $$('a[href^="#"]');
        links.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const target = $(`#${targetId}`);
            if (target) {
                target.getBoundingClientRect();
            }
        });
    }
}

// ===================================
// Accessibility Enhancements
// ===================================

class AccessibilityHelper {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardSupport();
        this.addFocusVisible();
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = new MobileMenu();
                mobileMenu.closeMenu();
            }
        });

        const focusableElements = $$('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                        element.click();
                    }
                }
            });
        });
    }

    addFocusVisible() {
        let hadKeyboardEvent = true;

        document.addEventListener('keydown', () => {
            hadKeyboardEvent = true;
        });

        document.addEventListener('mousedown', () => {
            hadKeyboardEvent = false;
        });

        document.addEventListener('focusin', (e) => {
            if (hadKeyboardEvent) {
                e.target.classList.add('focus-visible');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }
}

// ===================================
// Initialize All Components
// ===================================

class App {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        new MobileMenu();
        new SmoothScroll();
        new HeaderScroll();
        new ScrollAnimations();
        new TabsManager();
        new FormValidator();
        new Gallery();
        new ActiveNavigation();
        new ParallaxHero();
        new ServiceCards();
        new ReviewsAnimation();
        new LazyLoader();
        new PerformanceOptimizer();
        new AccessibilityHelper();

        this.addLoadedClass();
    }

    addLoadedClass() {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
}

new App();
