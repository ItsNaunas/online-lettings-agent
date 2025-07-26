// Online Letting Agents - Main Application
console.log('🚀 Online Letting Agents script loading...');

// Test function to verify JavaScript is working
function testJavaScript() {
  console.log('✅ JavaScript is working!');
  return true;
}

// Call test function
testJavaScript();

// Main Application Module - encapsulates all functionality to avoid global pollution
const OnlineLettingAgents = (() => {
    'use strict';
    
    // Private variables
    let currentPage = '';
    
    // Initialize application
    function init() {
        currentPage = getCurrentPage();
        console.log('Initializing OnlineLettingAgents app for page:', currentPage);
        
        // Initialize common functionality
        initNavigation();
        initScrollAnimations();
        if (typeof initLazyLoading === 'function') {
            initLazyLoading();
        }
        
        // Initialize page-specific functionality
        if (currentPage === 'index') {
            initHomePage();
        } else if (currentPage === 'quotation') {
            initQuotationPage();
        }
    }
    
    // Determine current page without hardcoded paths
    function getCurrentPage() {
        const body = document.body;
        if (body && body.dataset && body.dataset.page) {
            console.log('Page detected from data-page:', body.dataset.page);
            return body.dataset.page;
        }
        // Fallback to URL checking
        const path = window.location.pathname;
        console.log('Checking URL path:', path);
        if (path.includes('quotation')) {
            console.log('Detected quotation page from URL');
            return 'quotation';
        }
        console.log('Defaulting to index page');
        return 'index';
    }
    
    // Navigation functionality
    function initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', toggleMobileMenu);
            
            // Close menu when clicking outside or pressing Escape
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEscapeKey);
            
            // Add scroll effect to navbar
            initNavbarScroll();
        }
        
        // Initialize smooth scrolling for anchor links
        initSmoothScrolling();
    }
    
    function toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attributes
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        }
    }
    
    function handleOutsideClick(e) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu && hamburger && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    }
    
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    }
    
    function closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
    
    function initNavbarScroll() {
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }
    
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }
    
    // Home page specific functionality
    function initHomePage() {
        initTestimonials();
        initPropertiesCarousel();
        initPricingTabs();
        initFAQ();
        initModals();
        initChat();
        initContactBar();
    }
    
    function initTestimonials() {
        // Testimonials functionality is handled by global functions
        console.log('Testimonials initialized');
    }
    
    function initPropertiesCarousel() {
        // Properties carousel functionality is handled by global functions
        console.log('Properties carousel initialized');
    }
    
    function initPricingTabs() {
        // Pricing tabs functionality is handled by global functions
        console.log('Pricing tabs initialized');
    }
    
    function initFAQ() {
        // FAQ functionality is handled by global functions
        console.log('FAQ initialized');
    }
    
    function initModals() {
        // Modal functionality is now handled by the new working modals
        console.log('Working modals initialized');
    }
    
    function initChat() {
        const chatBubble = document.getElementById('chat-bubble');
        const chatWidget = document.getElementById('chat-widget');
        const closeChatBtn = document.getElementById('close-chat-widget');
        
        if (chatBubble && chatWidget) {
            chatBubble.addEventListener('click', () => {
                chatBubble.style.display = 'none';
                chatWidget.style.display = 'block';
            });
            
            if (closeChatBtn) {
                closeChatBtn.addEventListener('click', () => {
                    chatWidget.style.display = 'none';
                    chatBubble.style.display = 'block';
                });
            }
        }
    }
    
    // Initialize contact bar
    function initContactBar() {
        console.log('Contact bar initialized');
    }
    
    // Quotation page functionality
    function initQuotationPage() {
        QuotationWizard.init();
    }
    
    // Expose public API
    return {
        init,
        getCurrentPage: () => currentPage
    };
})();

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    OnlineLettingAgents.init();
    preselectPackageFromURL();
    renderPackageOptions();
    enhancePackageAndAddonCards();
    initSummaryAndConsent();
    activateScrollAnimations();
    initPageInteractions();
    initFAQAccordion();
});

// Testimonials Slider
let currentSlide = 1;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    // Safety check - exit if testimonials don't exist
    if (!testimonials || testimonials.length === 0) return;
    
    // Handle slide boundaries
    if (n > testimonials.length) currentSlide = 1;
    if (n < 1) currentSlide = testimonials.length;
    
    // Get current active testimonial
    const currentActive = document.querySelector('.testimonial.active');
    const targetTestimonial = testimonials[currentSlide - 1];
    
    // Safety check for target testimonial
    if (!targetTestimonial) return;
    
    // Remove active class from all dots (with safety check)
    if (dots && dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current dot
        if (dots[currentSlide - 1]) {
            dots[currentSlide - 1].classList.add('active');
        }
    }
    
    // Animate out current testimonial
    if (currentActive) {
        currentActive.classList.add('slide-out');
        setTimeout(() => {
            currentActive.classList.remove('active', 'slide-out');
        }, 400);
    }
    
    // Animate in new testimonial
    setTimeout(() => {
        if (targetTestimonial) {
            targetTestimonial.classList.add('active', 'slide-in');
            setTimeout(() => {
                targetTestimonial.classList.remove('slide-in');
            }, 800);
        }
    }, 400);
}

function nextSlide() {
    if (!testimonials || testimonials.length === 0) return;
    showSlide(currentSlide += 1);
}

function prevSlide() {
    if (!testimonials || testimonials.length === 0) return;
    showSlide(currentSlide -= 1);
}

function goToSlide(n) {
    showSlide(currentSlide = n);
}

// Auto-advance testimonials (will be started after DOM is ready)

// Properties Carousel
let currentPropertySlide = 1;
const propertyCards = document.querySelectorAll('.property-card');
const propertyDots = document.querySelectorAll('.property-dot');
const totalPropertySlides = Math.ceil(propertyCards.length / 3);

function showPropertySlide(n) {
    // Safety check - exit if property elements don't exist
    if (!propertyCards || propertyCards.length === 0) return;
    
    // Handle slide boundaries
    if (n > totalPropertySlides) currentPropertySlide = 1;
    if (n < 1) currentPropertySlide = totalPropertySlides;
    
    // Hide all property cards
    propertyCards.forEach(card => card.style.display = 'none');
    
    // Remove active class from dots (with safety check)
    if (propertyDots && propertyDots.length > 0) {
        propertyDots.forEach(dot => dot.classList.remove('active'));
    }
    
    // Show current property cards (show 3 at a time)
    const startIndex = (currentPropertySlide - 1) * 3;
    for (let i = startIndex; i < startIndex + 3 && i < propertyCards.length; i++) {
        if (propertyCards[i]) {
            propertyCards[i].style.display = 'block';
        }
    }
    
    // Update dots (with safety check)
    if (propertyDots && propertyDots[currentPropertySlide - 1]) {
        propertyDots[currentPropertySlide - 1].classList.add('active');
    }
}

function nextPropertySlide() {
    if (!propertyCards || propertyCards.length === 0) return;
    currentPropertySlide++;
    showPropertySlide(currentPropertySlide);
}

function prevPropertySlide() {
    if (!propertyCards || propertyCards.length === 0) return;
    currentPropertySlide--;
    showPropertySlide(currentPropertySlide);
}

function goToPropertySlide(n) {
    currentPropertySlide = n;
    showPropertySlide(currentPropertySlide);
}

// Auto-advance properties carousel (will be started after DOM is ready)

    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right, .scale-in, .bounce-in');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    // Initialize lazy loading
    function initLazyLoading() {
        // Only initialize if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    // }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        // Ignore bare '#' or empty href
        if (hash === '#' || hash.length <= 1) return;
        
        const target = document.querySelector(hash);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle with accessibility
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isExpanded = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Close menu when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--white)';
        navbar.style.backdropFilter = 'none';
    }
});

// --- Consolidated IntersectionObserver for all scroll animations ---
function activateScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right, .scale-in, .bounce-in, .service-card, .pricing-card, .testimonial-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    setTimeout(() => {
        try {
            showPropertySlide(1);
            if (!window._carouselIntervalsStarted) {
                if (document.querySelectorAll('.testimonial').length > 0) {
                    setInterval(nextSlide, 5000);
                }
                if (document.querySelectorAll('.property-card').length > 0) {
                    setInterval(nextPropertySlide, 4000);
                }
                window._carouselIntervalsStarted = true;
            }
        } catch (error) {
            console.error('Error starting carousels:', error);
        }
    }, 1000);
}

// Form validation for contact forms (if any are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Initialize tooltips or other UI enhancements
function initPageInteractions() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}


function selectPlan(card) {
    document.querySelectorAll('.pricing-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
} 

// FAQ Accordion functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });

            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// Quotation Wizard Module - handles multi-step form functionality
const QuotationWizard = (() => {
    'use strict';
    
    // Private variables
    let currentStep = 0;
    let steps = [];
    let form = null;
    const STORAGE_KEY = 'ola-quote-progress-v1';
    
    // Public API
    function init() {
        console.log('Initializing QuotationWizard...');
        
        form = document.getElementById('quotationBuilderForm');
        steps = Array.from(document.querySelectorAll('.quote-step'));
        
        if (!form || steps.length === 0) {
            console.log('Quotation form not found, skipping wizard initialization');
            return;
        }
        
        initElements();
        initEventListeners();
        initProgressPersistence();
        showStep(0); // Start fresh
        
        console.log(`QuotationWizard initialized with ${steps.length} steps`);
    }
    
    function initElements() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitQuote');
        
        if (!prevBtn || !nextBtn || !submitBtn) {
            console.error('Required navigation buttons not found');
            return;
        }
    }
    
    function initEventListeners() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitQuote');
        
        prevBtn?.addEventListener('click', handlePrevious);
        nextBtn?.addEventListener('click', handleNext);
        submitBtn?.addEventListener('click', handleSubmit);
        
        // Auto-save progress
        form?.addEventListener('input', saveProgress);
        form?.addEventListener('change', saveProgress);
        
        // Handle edit links in summary
        document.querySelectorAll('[data-edit-step]').forEach(link => {
            link.addEventListener('click', function() {
                const step = parseInt(this.getAttribute('data-edit-step'), 10) - 1;
                if (!isNaN(step) && step >= 0 && step < steps.length) {
                    goToStep(step);
                }
            });
        });
    }
    
    function handlePrevious() {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    }
    
    function handleNext() {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                goToStep(currentStep + 1);
            }
        }
    }
    
    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        if (!validateConsent()) {
            alert('Please confirm your consent to be contacted before submitting your quote.');
            return;
        }

        try {
            await submitQuotationForm();
            clearProgress();
            showSuccessModal();
            form.reset();
            goToStep(0);
        } catch (error) {
            console.error('Error submitting quotation:', error);
            alert('There was an error submitting your form.');
        }
    }
    
    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        
        currentStep = stepIndex;
        showStep(stepIndex);
        saveProgress();
    }
    
    function showStep(stepIndex) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Show current step
        const currentStepElement = steps[stepIndex];
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update stepper visual indicators
        updateStepperIndicators(stepIndex);
        
        // Update navigation buttons
        updateNavigationButtons(stepIndex);
        
        console.log(`Showing step ${stepIndex + 1} of ${steps.length}`);
    }
    
    function updateStepperIndicators(stepIndex) {
        const stepperItems = document.querySelectorAll('#quotationStepper .step');
        stepperItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index < stepIndex) {
                item.classList.add('completed');
            } else if (index === stepIndex) {
                item.classList.add('active');
            }
        });
    }
    
    function updateNavigationButtons(stepIndex) {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitQuote');
        
        if (prevBtn) prevBtn.disabled = stepIndex === 0;
        
        if (nextBtn && submitBtn) {
            if (stepIndex === steps.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
                submitBtn.style.display = 'none';
            }
        }
    }
    
    function validateStep(stepIndex) {
        const stepElement = steps[stepIndex];
        if (!stepElement) return true;
        
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;
        
        // Clear previous error messages
        stepElement.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        if (!isValid) {
            scrollToFirstError(stepElement);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        errorMsg.style.cssText = 'color:#dc3545;font-size:0.8rem;margin-top:0.25rem;';
        
        const fieldContainer = field.closest('.form-group');
        if (fieldContainer) {
            fieldContainer.appendChild(errorMsg);
        }
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
    }
    
    function scrollToFirstError(stepElement) {
        const firstError = stepElement.querySelector('.error-message');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Progress persistence
    function saveProgress() {
        if (!form) return;
        
        const data = { currentStep, values: {} };
        const elements = form.elements;
        
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (!el.name) continue;
            
            if (el.type === 'checkbox') {
                if (!data.values[el.name]) data.values[el.name] = [];
                if (el.checked) data.values[el.name].push(el.value);
            } else if (el.type === 'radio') {
                if (el.checked) data.values[el.name] = el.value;
            } else {
                data.values[el.name] = el.value;
            }
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    function restoreProgress() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        
        try {
            const data = JSON.parse(raw);
            const values = data.values || {};
            
            for (const [name, value] of Object.entries(values)) {
                const els = form.elements[name];
                if (!els) continue;
                
                if (Array.isArray(els)) {
                    els.forEach(el => {
                        if (el.type === 'checkbox') el.checked = value.includes(el.value);
                        else if (el.type === 'radio') el.checked = (el.value === value);
                        else el.value = value;
                    });
                } else if (els.type === 'checkbox') {
                    els.checked = value.includes(els.value);
                } else if (els.type === 'radio') {
                    els.checked = (els.value === value);
                } else {
                    els.value = value;
                }
            }
            
            // Restore step position
            goToStep(data.currentStep || 0);
        } catch (e) {
            console.warn('Failed to restore progress:', e);
        }
    }
    
    function clearProgress() {
        localStorage.removeItem(STORAGE_KEY);
    }
    
    function initProgressPersistence() {
        // Start fresh - clear any existing progress
        clearProgress();
    }
    
    function showSuccessModal() {
        let modal = document.getElementById('quoteSuccessModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quoteSuccessModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width:400px;text-align:center;">
                    <button class="close" aria-label="Close">&times;</button>
                    <h2>Thank you!</h2>
                    <p>Your quotation has been submitted successfully.<br>We'll be in touch soon with next steps.</p>
                    <button class="btn btn-primary" id="closeSuccessModal">Close</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
        
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        };
        
        modal.querySelector('.close').onclick = closeModal;
        modal.querySelector('#closeSuccessModal').onclick = closeModal;
    }
    
    // Public API
    return {
        init,
        goToStep,
        getCurrentStep: () => currentStep,
        getTotalSteps: () => steps.length
    };
})();


// Modal Management System
function openModal(modal) {
  console.log('🔍 openModal called with:', modal);
  
  if (!modal) {
    console.error('❌ openModal called with null/undefined modal');
    return;
  }
  
  console.log('🔍 Modal computed style before:', window.getComputedStyle(modal).display);
  console.log('🔍 Modal visibility before:', window.getComputedStyle(modal).visibility);
  console.log('🔍 Modal opacity before:', window.getComputedStyle(modal).opacity);
  
  modal.classList.add('is-open');
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.zIndex = '9999';
  document.body.classList.add('no-scroll');
  
  console.log('🔍 Modal computed style after:', window.getComputedStyle(modal).display);
  console.log('🔍 Modal visibility after:', window.getComputedStyle(modal).visibility);
  console.log('🔍 Modal opacity after:', window.getComputedStyle(modal).opacity);
  console.log('🔍 Modal is-open class:', modal.classList.contains('is-open'));
  console.log('🔍 Body no-scroll class:', document.body.classList.contains('no-scroll'));
  
  // Safety check - if modal isn't visible after 100ms, unfreeze
  setTimeout(() => {
    const isVisible = window.getComputedStyle(modal).display !== 'none';
    console.log('🔍 Safety check - modal visible:', isVisible);
    if (!isVisible) {
      console.error('❌ Modal failed to display! Unfreezing page...');
      document.body.classList.remove('no-scroll');
      modal.classList.remove('is-open');
    }
  }, 100);
  
  // Focus first input or button
  setTimeout(() => {
    const firstFocusable = modal.querySelector('input, button, select, textarea');
    if (firstFocusable) {
      console.log('🔍 Focusing first focusable element:', firstFocusable);
      firstFocusable.focus();
    }
  }, 10);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.style.display = 'none';
  document.body.classList.remove('no-scroll');
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal.is-open');
    if (openModal) {
      closeModal(openModal);
    }
  }
});

// Close modal when clicking backdrop
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Emergency unfreeze function - call this in console if page freezes
function emergencyUnfreeze() {
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('is-open');
    modal.style.display = 'none';
  });
  console.log('Page unfrozen - scroll restored');
}

function openContactForm() {
  const modal = document.getElementById('contactFormModal');
  openModal(modal);
}

function closeContactForm() {
  const modal = document.getElementById('contactFormModal');
  closeModal(modal);
}

// Pricing Tab Switching Logic
function showPricingTab(tab, btn) {
    // Hide all tabs
    document.querySelectorAll('.pricing-tab').forEach(tabEl => tabEl.classList.remove('active'));
    // Remove active from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btnEl => btnEl.classList.remove('active'));
    // Show selected tab
    document.getElementById(tab + '-tab').classList.add('active');
    // Set active on clicked button
    if (btn) btn.classList.add('active');
}

// Branded Chat Widget Logic with Chatbot
(function() {
  const chatBubble = document.getElementById('chat-bubble');
  const chatWidget = document.getElementById('chat-widget');
  const closeBtn = document.getElementById('close-chat-widget');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const sendBtn = document.getElementById('send-chat');

  // Chatbot responses and logic
  const botResponses = {
    greetings: [
      "Hello! I'm here to help with your lettings needs. How can I assist you today?",
      "Hi there! Welcome to Online Letting Agents. What can I help you with?",
      "Hello! I'm your virtual lettings assistant. How may I help you today?"
    ],
    services: {
      keywords: ['service', 'services', 'what do you do', 'help with', 'offer'],
      responses: [
        "We offer comprehensive lettings services including:\n• Let-only service\n• Rent collection\n• Full property management\n• HMO licensing support\n• Tenant screening\n\nWhich service interests you most?"
      ]
    },
    pricing: {
      keywords: ['price', 'cost', 'fee', 'charge', 'how much', 'pricing', 'expensive'],
      responses: [
        "Our pricing varies by service level:\n• Bronze (Let-only): From £99/month\n• Silver (Rent collection): From £149/month\n• Gold (Fully managed): From £199/month\n• Platinum (Premium + protection): Custom quote\n\nWould you like detailed pricing for any specific service?"
      ]
    },
    hmo: {
      keywords: ['hmo', 'house in multiple occupation', 'licensing', 'licence', 'student property'],
      responses: [
        "Great question! We specialize in HMO licensing and management. We have a 92% first-time approval rate for HMO applications.\n\nOur HMO services include:\n• License application support\n• Compliance checks\n• Safety certifications\n• Ongoing management\n\nWould you like to know more about our HMO services?"
      ]
    },
    tenants: {
      keywords: ['tenant', 'tenants', 'find tenants', 'screening', 'references'],
      responses: [
        "We provide comprehensive tenant services:\n• Professional tenant screening\n• Credit and reference checks\n• Right to Rent verification\n• Inventory management\n• Deposit protection\n\nOur thorough process ensures quality tenants for your property. Need help finding tenants?"
      ]
    },
    maintenance: {
      keywords: ['maintenance', 'repairs', 'fix', 'broken', 'emergency'],
      responses: [
        "Our maintenance services include:\n• 24/7 emergency response\n• Routine maintenance coordination\n• Qualified contractor network\n• Regular property inspections\n• Maintenance reporting\n\nThis is included in our Gold and Platinum packages. Would you like more details?"
      ]
    },
    contact: {
      keywords: ['contact', 'phone', 'call', 'email', 'speak to someone', 'human'],
      responses: [
        "I'd be happy to connect you with our team!\n\n📞 Phone: 01234 567890\n📧 Email: hello@onlinelettingagents.co.uk\n💬 WhatsApp: Available via our contact bar\n\nYou can also book a call or viewing using the buttons at the top of the page. What would work best for you?"
      ]
    },
    quote: {
      keywords: ['quote', 'quotation', 'estimate', 'valuation', 'how much for my property'],
      responses: [
        "I can help you get a personalized quote! Our quotation tool takes just a few minutes and covers:\n• Property details\n• Service requirements\n• Licensing needs\n• Custom pricing\n\nWould you like me to start your quote, or would you prefer to speak with our team first?"
      ]
    },
    location: {
      keywords: ['area', 'location', 'coventry', 'midlands', 'where', 'coverage'],
      responses: [
        "We primarily serve Coventry and the Midlands area. Our local expertise includes:\n• Deep knowledge of local regulations\n• Established contractor network\n• University area specialization\n• Council relationship management\n\nIs your property in our coverage area?"
      ]
    }
  };

  const fallbackResponses = [
    "That's a great question! Let me connect you with one of our lettings experts who can provide detailed information. You can call us at 01234 567890 or book a consultation.",
    "I'd love to help you with that! For specific questions like this, our experienced team can give you the best advice. Would you like to schedule a call?",
    "Thanks for asking! While I can help with general information, our lettings specialists can provide detailed guidance for your specific situation. Shall I help you get in touch?"
  ];

  let conversationState = {
    hasGreeted: false,
    lastTopic: null,
    messageCount: 0
  };

  function renderOptions(options) {
    // Remove any existing options
    const oldOptions = chatWidget.querySelector('.chat-options');
    if (oldOptions) oldOptions.remove();
    // Create options container
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'chat-options';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn';
      btn.type = 'button';
      btn.textContent = opt.label;
      btn.onclick = () => {
        // Remove options after click
        optionsDiv.remove();
        handleUserMessage(opt.value);
      };
      optionsDiv.appendChild(btn);
    });
    chatMessages.appendChild(optionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function openChat(e) {
    if (e) e.preventDefault();
    chatWidget.style.display = 'flex';
    chatBubble.style.display = 'none';
    // Send welcome message if first time opening
    if (!conversationState.hasGreeted) {
      setTimeout(() => {
        addBotMessage(getRandomResponse(botResponses.greetings));
        renderOptions([
          { label: 'Our Services', value: 'What services do you offer?' },
          { label: 'Pricing', value: 'How much does it cost?' },
          { label: 'Book a Call', value: 'I want to book a call' },
          { label: 'Get a Quote', value: 'I want a quote' },
        ]);
        conversationState.hasGreeted = true;
      }, 500);
    }
    setTimeout(() => { if (chatInput) chatInput.focus(); }, 10);
  }

  function closeChat(e) {
    if (e) e.preventDefault();
    chatWidget.style.display = 'none';
    chatBubble.style.display = 'flex';
    chatBubble.focus();
  }

  function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  function findBestResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/) && conversationState.messageCount < 2) {
      return getRandomResponse(botResponses.greetings);
    }

    // Check each category for keyword matches
    for (const [category, data] of Object.entries(botResponses)) {
      if (category === 'greetings') continue;
      
      if (data.keywords && data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        conversationState.lastTopic = category;
        return getRandomResponse(data.responses);
      }
    }

    // Contextual follow-ups
    if (conversationState.lastTopic && lowerMessage.match(/\b(yes|yeah|sure|tell me more|more info|details)\b/)) {
      return "Great! I'd recommend speaking with our team for detailed information. You can call 01234 567890, book a viewing, or start our quick quotation tool. What would you prefer?";
    }

    // Default fallback
    return getRandomResponse(fallbackResponses);
  }

  function addUserMessage(text) {
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addBotMessage(text, options) {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    
    // Handle line breaks in bot messages
    const lines = text.split('\n');
    if (lines.length > 1) {
      lines.forEach((line, index) => {
        if (index > 0) botMsg.appendChild(document.createElement('br'));
        botMsg.appendChild(document.createTextNode(line));
      });
    } else {
      botMsg.textContent = text;
    }
    
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // Show options if provided
    if (options && Array.isArray(options)) {
      renderOptions(options);
    }
  }

  function handleUserMessage(text) {
    addUserMessage(text);
    conversationState.messageCount++;
    // Remove any options
    const oldOptions = chatWidget.querySelector('.chat-options');
    if (oldOptions) oldOptions.remove();
    // Show typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message bot typing';
    typingMsg.innerHTML = '<span>●</span><span>●</span><span>●</span>';
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      chatMessages.removeChild(typingMsg);
      const response = findBestResponse(text);
      // Show context options for certain topics
      let options = null;
      if (/service/i.test(text)) {
        options = [
          { label: 'Let Only', value: 'Tell me about Let Only' },
          { label: 'Full Management', value: 'Tell me about Full Management' },
          { label: 'HMO Licensing', value: 'Do you help with HMO licensing?' },
        ];
      } else if (/price|cost|fee|charge|how much|pricing|expensive/i.test(text)) {
        options = [
          { label: 'Let Only Pricing', value: 'How much is Let Only?' },
          { label: 'Full Management Pricing', value: 'How much is Full Management?' },
          { label: 'Get a Quote', value: 'I want a quote' },
        ];
      } else if (/quote|quotation|estimate|valuation/i.test(text)) {
        options = [
          { label: 'Start Quotation', value: 'Start my quote' },
          { label: 'Speak to Team', value: 'I want to speak to someone' },
        ];
      } else if (/contact|phone|call|email|speak to someone|human/i.test(text)) {
        options = [
          { label: 'Book a Call', value: 'I want to book a call' },
          { label: 'WhatsApp', value: 'Can I WhatsApp you?' },
          { label: 'Email', value: 'What is your email?' },
        ];
      }
      addBotMessage(response, options);
      if (conversationState.messageCount >= 3 && Math.random() > 0.6) {
        setTimeout(() => {
          addBotMessage("Is there anything specific you'd like help with today? I can also connect you directly with our team if you prefer to speak with a human! 😊");
        }, 1500);
      }
    }, 1000 + Math.random() * 1000);
  }

  if (chatBubble && chatWidget && closeBtn && chatInput && chatMessages && sendBtn) {
    chatBubble.addEventListener('click', openChat);
    chatBubble.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChat(e);
      }
    });
    closeBtn.addEventListener('click', closeChat);
    
    document.addEventListener('keydown', function(e) {
      if (chatWidget.style.display === 'flex' && e.key === 'Escape') {
        closeChat(e);
      }
    });

    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      
      handleUserMessage(text);
      chatInput.value = '';
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
})(); 

function preselectPackageFromURL() {
  if (!window.location.pathname.endsWith('quotation.html')) return;
  const urlParams = new URLSearchParams(window.location.search);
  const preselected = urlParams.get('package');
  if (preselected) {
    const trySelect = () => {
      const pkgInput = document.querySelector(`[name='package'][value='${preselected.toLowerCase()}']`);
      if (pkgInput) {
        pkgInput.checked = true;
        const step5 = document.getElementById('qb-step-5');
        if (step5) step5.scrollIntoView({behavior: 'smooth'});
      } else {
        setTimeout(trySelect, 100);
      }
    };
    trySelect();
  }
}

// Quotation Builder: Render package options and add-ons
function renderPackageOptions() {
  if (!window.location.pathname.endsWith('quotation.html')) return;
  if (!document.getElementById('qbPackageOptions')) return;

      // Define your packages
      const packages = [
        { value: 'silver', name: 'Silver - Let Only', price: '£99/month' },
        { value: 'gold', name: 'Gold - Rent Collection', price: '£149/month' },
        { value: 'platinum', name: 'Platinum - Full Management', price: '£199/month' },
        { value: 'platinum-plus', name: 'Platinum Plus - Full Mgmt + Licence', price: '£249/month' }
      ];

      // Define your add-ons
      const addons = [
        { value: 'epc', label: 'EPC Check (£50)' },
        { value: 'gas-safety', label: 'Gas Safety Certificate (£75)' },
        { value: 'eicr', label: 'EICR (£150)' },
        { value: 'floor-plan', label: 'Floor Plan (£100)' },
        { value: 'inventory', label: 'Inventory & Schedule (£120)' },
        { value: 'checkout', label: 'Check-out Inspection (£80)' },
        { value: 'licensing', label: 'Licensing Consultancy (£200)' },
        { value: 'additional-referencing', label: 'Additional Tenant Referencing (£25)' },
        { value: 'rent-protection', label: 'Rent Protection Insurance (£15/month)' },
        { value: 'property-visit', label: 'Property Visit / Compliance Health Check (£150)' }
      ];

      // Render packages
      const pkgContainer = document.getElementById('qbPackageOptions');
      pkgContainer.innerHTML = packages.map(pkg => `
        <label class="package-option">
          <input type="radio" name="package" value="${pkg.value}" required>
          <span class="package-name">${pkg.name}</span>
          <span class="package-price">${pkg.price}</span>
        </label>
      `).join('');

      // Render add-ons
      const addonContainer = document.getElementById('qbAddonsGrid');
      addonContainer.innerHTML = addons.map(addon => `
        <label class="addon-option">
          <input type="checkbox" name="addons" value="${addon.value}">
          <span>${addon.label}</span>
        </label>
      `).join('');

      // Add event listeners for package selection to update summary
      const packageInputs = document.querySelectorAll('input[name="package"]');
      const addonInputs = document.querySelectorAll('input[name="addons"]');
      
      function updateQuoteSummary() {
        const selectedPackage = document.querySelector('input[name="package"]:checked');
        const selectedAddons = document.querySelectorAll('input[name="addons"]:checked');
        const summaryContainer = document.getElementById('qbQuoteSummary');
        
        if (!summaryContainer) return;
        
        let summaryHTML = '<div class="summary-section"><h4>Selected Package</h4>';
        if (selectedPackage) {
          const pkg = packages.find(p => p.value === selectedPackage.value);
          summaryHTML += `<div>${pkg.name} - ${pkg.price}</div>`;
        } else {
          summaryHTML += '<div>Please select a package</div>';
        }
        summaryHTML += '</div>';
        
        summaryHTML += '<div class="summary-section"><h4>Selected Add-ons</h4>';
        if (selectedAddons.length > 0) {
          const addonList = Array.from(selectedAddons).map(input => {
            const addon = addons.find(a => a.value === input.value);
            return addon.label;
          }).join(', ');
          summaryHTML += `<div>${addonList}</div>`;
        } else {
          summaryHTML += '<div>None selected</div>';
        }
        summaryHTML += '</div>';
        
        // Calculate total cost (simplified)
        let totalCost = 0;
        if (selectedPackage) {
          const pkgPrice = parseInt(selectedPackage.value === 'silver' ? '99' : 
                                  selectedPackage.value === 'gold' ? '149' : 
                                  selectedPackage.value === 'platinum' ? '199' : '249');
          totalCost += pkgPrice;
        }
        
        selectedAddons.forEach(addon => {
          const addonCost = parseInt(addon.value === 'epc' ? '50' :
                                   addon.value === 'gas-safety' ? '75' :
                                   addon.value === 'eicr' ? '150' :
                                   addon.value === 'floor-plan' ? '100' :
                                   addon.value === 'inventory' ? '120' :
                                   addon.value === 'checkout' ? '80' :
                                   addon.value === 'licensing' ? '200' :
                                   addon.value === 'additional-referencing' ? '25' :
                                   addon.value === 'rent-protection' ? '15' :
                                   addon.value === 'property-visit' ? '150' : '0');
          totalCost += addonCost;
        });
        
        summaryHTML += `<div class="summary-section"><h4>Total Estimated Cost</h4><div>£${totalCost}</div></div>`;
        
        summaryContainer.innerHTML = summaryHTML;
      }
      
      // Add event listeners
      packageInputs.forEach(input => {
        input.addEventListener('change', updateQuoteSummary);
      });

      addonInputs.forEach(input => {
        input.addEventListener('change', updateQuoteSummary);
      });

      updateQuoteSummary();
}

// Enhanced Package and Add-on Card Interactions
function enhancePackageAndAddonCards() {
  if (!window.location.pathname.endsWith('quotation.html')) return;
  
  // 📦 Style and handle package card interactions
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    
    // Handle card clicks
    card.addEventListener('click', function(e) {
      if (e.target.type !== 'radio') {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });
    
    // Handle radio button changes
    radio.addEventListener('change', function() {
      // Remove selected class from all cards
      packageCards.forEach(c => {
        c.classList.remove('selected', 'selecting');
      });
      
      if (this.checked) {
        // Add selecting animation
        card.classList.add('selecting');
        
        // Add selected state after animation
        setTimeout(() => {
          card.classList.remove('selecting');
          card.classList.add('selected');
        }, 300);
      }
    });
  });
  
  // 🧩 Style and handle add-on card interactions
  const addOnCards = document.querySelectorAll('.addon-card');
  addOnCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    
    // Handle card clicks
    card.addEventListener('click', function(e) {
      if (e.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
    
    // Handle checkbox changes
    checkbox.addEventListener('change', function() {
      // Add selecting animation
      card.classList.add('selecting');
      
      setTimeout(() => {
        card.classList.remove('selecting');
        
        if (this.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      }, 150);
    });
  });
  
  console.log(`Enhanced ${packageCards.length} package cards and ${addOnCards.length} add-on cards`);
}

// Enhanced Summary & Consent Section Polish
let validateConsent = () => true;
function initSummaryAndConsent() {
  if (!window.location.pathname.endsWith('quotation.html')) return;
  
  // 🎨 Improve consent checkbox layout - this is already handled by CSS, but ensure it's properly structured
  const consentWrapper = document.querySelector('.consent-section');
  if (consentWrapper) {
    console.log('Enhanced consent section layout');
  }

  // 📦 Style the summary panel with clean, professional headers
  const summaryPanel = document.querySelector('.quote-summary-box');
  if (summaryPanel) {
    console.log('Enhanced summary panel styling - clean professional headers');
    
    // Ensure headers are clean and professional (no emojis)
    const labels = summaryPanel.querySelectorAll('h4 strong');
    if (labels.length >= 3) {
      // Remove any existing emojis and keep clean text
      labels[0].innerText = labels[0].innerText.replace(/📦\s*/, '');
      labels[1].innerText = labels[1].innerText.replace(/➕\s*/, '');
      labels[2].innerText = labels[2].innerText.replace(/🏠\s*/, '');
    }
  }

  // 🟢 Enhanced button interactions
  const buttonRow = document.querySelector('.summary-buttons');
  if (buttonRow) {
    console.log('Enhanced button styling and interactions');
    
    const submitBtn = buttonRow.querySelector('.submit-quote-btn');
    if (submitBtn) {
      // Add subtle hover animation
      submitBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
      });
      
      submitBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    }
  }

  // ✅ Add completion indicators to completed steps
  function updateStepCompletionIndicators() {
    const stepperItems = document.querySelectorAll('#quotationStepper .step');
    stepperItems.forEach((item, index) => {
      if (item.classList.contains('completed')) {
        // Add a visual completion indicator
        if (!item.querySelector('.completion-check')) {
          const check = document.createElement('span');
          check.className = 'completion-check';
          check.innerHTML = '✓';
          check.style.cssText = `
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--green);
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          `;
          item.style.position = 'relative';
          item.appendChild(check);
        }
      }
    });
  }

  // 🔄 Update completion indicators when steps change
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateStepCompletionIndicators();
      }
    });
  });

  // Observe stepper changes
  const stepperItems = document.querySelectorAll('#quotationStepper .step');
  stepperItems.forEach(item => {
    observer.observe(item, { attributes: true });
  });

  // 🎯 Polish contact method dropdown
  const contactSelect = document.querySelector('#contactMethod');
  if (contactSelect) {
    // Add subtle focus animation
    contactSelect.addEventListener('focus', function() {
      this.style.transform = 'scale(1.01)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    contactSelect.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // 🔒 Enhanced consent validation
  const consentCheckbox = document.querySelector('input[name="consent"]');
  const submitBtn = document.querySelector('#submitQuote');

  if (consentCheckbox && submitBtn) {
    validateConsent = function() {
      if (!consentCheckbox.checked) {
        // Add visual feedback for missing consent
        const consentContainer = document.querySelector('.consent-container');
        if (consentContainer) {
          consentContainer.style.borderColor = '#dc3545';
          consentContainer.style.backgroundColor = '#fff5f5';
          
          // Remove error styling after a delay
          setTimeout(() => {
            consentContainer.style.borderColor = '#e2e8f0';
            consentContainer.style.backgroundColor = '#f7f7f7';
          }, 3000);
        }
        return false;
      }
      return true;
    };
    
    // Real-time feedback when consent is checked
    consentCheckbox.addEventListener('change', function() {
      const consentContainer = document.querySelector('.consent-container');
      if (consentContainer) {
        if (this.checked) {
          consentContainer.style.borderColor = 'var(--green)';
          consentContainer.style.backgroundColor = 'rgba(35, 97, 61, 0.05)';
        } else {
          consentContainer.style.borderColor = '#e2e8f0';
          consentContainer.style.backgroundColor = '#f7f7f7';
        }
      }
    });
    
    console.log('Consent validation implemented');
  }

  console.log('Summary and consent section enhancements applied');
}

// --- QUOTATION FORM SUBMISSION TO GOOGLE APPS SCRIPT ---
function collectFormData() {
  const visitDateTime = document.getElementById('visitDate')?.value || '';
  let visitDate = '';
  let visitTime = '';

  if (visitDateTime) {
    const dt = new Date(visitDateTime);
    visitDate = dt.toISOString().split('T')[0];
    visitTime = dt.toTimeString().split(' ')[0].substring(0, 5);
  }

  return {
    submissionDate: new Date().toISOString(),
    clientName: document.getElementById('clientName')?.value || '',
    companyNumber: document.getElementById('companyNumber')?.value || '',
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    contactAddress: document.getElementById('contactAddress')?.value || '',
    howHeard: document.getElementById('howHeard')?.value || '',
    propertyAddress: document.getElementById('propertyAddress')?.value || '',
    propertyType: document.getElementById('propertyType')?.value || '',
    bedrooms: document.getElementById('bedrooms')?.value || '',
    bathrooms: document.getElementById('bathrooms')?.value || '',
    yearBuilt: document.getElementById('yearBuilt')?.value || '',
    currentlyOccupied: document.getElementById('currentlyOccupied')?.value || '',
    hasLicence: document.getElementById('hasLicence')?.value || '',
    lettingType: document.getElementById('lettingType')?.value || '',
    gasAppliances: document.getElementById('gasAppliances')?.value || '',
    hasEPC: document.getElementById('hasEPC')?.value || '',
    hasEICR: document.getElementById('hasEICR')?.value || '',
    needsLicenceCheck: document.getElementById('needsLicenceCheck')?.value || '',
    package: document.querySelector('input[name="package"]:checked')?.value || '',
    addons: Array.from(document.querySelectorAll('input[name="addons"]:checked')).map(a => a.value).join(', '),
    monthlyRent: document.getElementById('monthlyRent')?.value || '',
    moveInDate: document.getElementById('moveInDate')?.value || '',
    tenantType: document.getElementById('tenantType')?.value || '',
    specialRequirements: document.getElementById('specialRequirements')?.value || '',
    visitDate: visitDate,
    preferredTime: visitTime,
    contactMethod: document.getElementById('contactMethod')?.value || '',
    consent: document.querySelector('input[name="consent"]')?.checked || false
  };
}

async function submitQuotationForm() {
  const formData = collectFormData();
  console.log('Sending to Apps Script:', formData);

  await fetch('https://script.google.com/macros/s/AKfycbzAiBP4yIUEy8WI5sG6ud8wUYY7BmoEVQ7uOdeA3h1dIt_ndyIvcdS-gBUHsyBaGXgr/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
}

