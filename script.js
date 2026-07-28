/* ============================================
   NATHI PROJECTS - MAIN JAVASCRIPT
   ============================================ */

(function() {
  'use strict';

  // ----- DOM Elements -----
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const floatingWA = document.getElementById('floatingWA');
  const whatsappForm = document.getElementById('whatsappForm');
  const waNameInput = document.getElementById('waName');
  const waServiceSelect = document.getElementById('waService');
  const waMessageInput = document.getElementById('waMessage');
  
  // ----- State -----
  let isMobileMenuOpen = false;
  let lastScrollY = 0;

  // ----- Initialize Swiper Carousel -----
  function initSwiper() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded');
      return;
    }

    const swiper = new Swiper('#servicesSwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      speed: 500,
      
      pagination: {
        el: '#swiperPagination',
        clickable: true,
      },
      
      navigation: {
        nextEl: '#swiperNext',
        prevEl: '#swiperPrev',
      },
      
      breakpoints: {
        // Tablet
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        // Desktop
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        },
      },
      
      on: {
        init: function() {
          console.log('Swiper initialized');
        },
      },
    });

    return swiper;
  }

  // ----- Mobile Menu Toggle -----
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
      navLinks.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Animate hamburger
    const hamburger = mobileToggle.querySelector('.hamburger');
    if (hamburger) {
      if (isMobileMenuOpen) {
        hamburger.style.transform = 'rotate(45deg)';
        hamburger.style.top = '0';
        const before = hamburger.querySelector('::before');
        const after = hamburger.querySelector('::after');
      } else {
        hamburger.style.transform = 'rotate(0deg)';
      }
    }
  }

  function closeMobileMenu() {
    if (isMobileMenuOpen) {
      isMobileMenuOpen = false;
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ----- Sticky Header Scroll Effect -----
  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add shadow on scroll
    if (currentScrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
    
    // Hide floating button when near footer
    if (floatingWA) {
      const footer = document.querySelector('.footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (footerTop < windowHeight + 100) {
          floatingWA.style.opacity = '0';
          floatingWA.style.pointerEvents = 'none';
        } else {
          floatingWA.style.opacity = '1';
          floatingWA.style.pointerEvents = 'auto';
        }
      }
    }
    
    lastScrollY = currentScrollY;
  }

  // ----- Animated Counters -----
  function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (statNumbers.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = parseInt(el.getAttribute('data-duration'), 10) || 2000;
          
          animateCounter(el, target, duration);
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    statNumbers.forEach(num => observer.observe(num));
  }

  function animateCounter(element, target, duration) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * eased);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(updateCounter);
  }

  // ----- Scroll Reveal Animations -----
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.service-card, .about-card, .project-card, .testimonial-card, .contact-tile'
    );
    
    if (revealElements.length === 0) return;

    revealElements.forEach(el => {
      el.classList.add('reveal');
    });

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ----- WhatsApp Quick Enquiry -----
  function handleWhatsAppSubmit(event) {
    event.preventDefault();
    
    const name = waNameInput.value.trim();
    const service = waServiceSelect.value;
    const message = waMessageInput.value.trim();
    
    // Build WhatsApp message
    let waMessage = 'Hello Nathi Projects,';
    
    if (name) {
      waMessage += ` my name is ${name}.`;
    }
    
    if (service) {
      waMessage += ` I'm interested in: ${service}.`;
    }
    
    if (message) {
      waMessage += ` ${message}`;
    }
    
    if (!name && !service && !message) {
      waMessage += ' I would like to enquire about your services.';
    }
    
    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappURL = `https://wa.me/27672280060?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    
    // Optional: Reset form
    whatsappForm.reset();
  }

  // ----- Smooth Scroll for Navigation Links -----
  function initSmoothScroll() {
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    allNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only process internal links
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          closeMobileMenu();
          
          // Smooth scroll to target
          const headerHeight = siteHeader.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // ----- Event Listeners -----
  function bindEvents() {
    // Mobile menu
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    if (navLinks) {
      navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
          closeMobileMenu();
        }
      });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isMobileMenuOpen && 
          !navLinks.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
    
    // Scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // WhatsApp form
    if (whatsappForm) {
      whatsappForm.addEventListener('submit', handleWhatsAppSubmit);
    }
    
    // Resize handler - close mobile menu on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  // ----- Initialize Everything -----
  function init() {
    console.log('Nathi Projects - Initializing...');
    
    // Initialize Swiper
    initSwiper();
    
    // Initialize counters
    initCounters();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Bind events
    bindEvents();
    
    // Initial scroll check
    handleScroll();
    
    console.log('Nathi Projects - Initialized successfully');
  }

  // ----- Start on DOM Ready -----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();