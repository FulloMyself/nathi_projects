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
  let servicesSwiper = null;

  // ----- Initialize Swiper Carousel -----
  function initSwiper() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded');
      return;
    }

    servicesSwiper = new Swiper('#servicesSwiper', {
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
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        },
      },
    });

    return servicesSwiper;
  }

  // ----- Service Filter Functionality -----
  function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.service-filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        
        // If using Swiper, we need to filter slides
        if (servicesSwiper) {
          filterSwiperSlides(category);
        }
      });
    });
  }

  function filterSwiperSlides(category) {
    const slides = document.querySelectorAll('#servicesSwiper .swiper-slide');
    
    if (category === 'all') {
      // Show all slides
      slides.forEach(slide => {
        slide.style.display = '';
      });
    } else {
      // Show only matching slides
      slides.forEach(slide => {
        const slideCategory = slide.getAttribute('data-category');
        if (slideCategory === category || slideCategory === 'all') {
          slide.style.display = '';
        } else {
          slide.style.display = 'none';
        }
      });
    }
    
    // Update Swiper after filtering
    if (servicesSwiper) {
      servicesSwiper.update();
      servicesSwiper.slideTo(0);
    }
  }

  // ----- Project Modal Functionality -----
  function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card[data-project]');
    const modals = document.querySelectorAll('.project-modal');
    
    // Open modal
    projectCards.forEach(card => {
      card.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const modal = document.getElementById(`modal-${projectId}`);
        if (modal) {
          openModal(modal);
        }
      });
    });
    
    // Close modal handlers
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      const overlay = modal.querySelector('.modal-overlay');
      
      closeBtn.addEventListener('click', () => closeModal(modal));
      overlay.addEventListener('click', () => closeModal(modal));
      
      // Close on Escape key
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(modal);
      });
    });
    
    // Thumbnail switching
    document.querySelectorAll('.modal-thumb').forEach(thumb => {
      thumb.addEventListener('click', function() {
        const mainImgSrc = this.getAttribute('data-main-img');
        const modalId = this.closest('.project-modal').id;
        const mainImg = document.getElementById(`modal-main-img-${modalId.replace('modal-', '')}`);
        
        if (mainImg && mainImgSrc) {
          mainImg.src = mainImgSrc;
          
          // Update active thumbnail
          this.parentElement.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });
  }

  function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus trap
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
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
    
    if (currentScrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
    
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
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  }

  function animateCounter(element, target, duration) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
    
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  }

  // ----- WhatsApp Quick Enquiry -----
  function handleWhatsAppSubmit(event) {
    event.preventDefault();
    
    const name = waNameInput.value.trim();
    const service = waServiceSelect.value;
    const message = waMessageInput.value.trim();
    
    let waMessage = 'Hello Nathi Projects,';
    if (name) waMessage += ` my name is ${name}.`;
    if (service) waMessage += ` I'm interested in: ${service}.`;
    if (message) waMessage += ` ${message}`;
    if (!name && !service && !message) waMessage += ' I would like to enquire about your services.';
    
    window.open(`https://wa.me/27672280060?text=${encodeURIComponent(waMessage)}`, '_blank', 'noopener,noreferrer');
    whatsappForm.reset();
  }

  // ----- Smooth Scroll -----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          closeMobileMenu();
          
          const headerHeight = siteHeader.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  // ----- Event Listeners -----
  function bindEvents() {
    if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
    
    if (navLinks) {
      navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) closeMobileMenu();
      });
    }
    
    document.addEventListener('click', (e) => {
      if (isMobileMenuOpen && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (whatsappForm) whatsappForm.addEventListener('submit', handleWhatsAppSubmit);
    
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) closeMobileMenu();
    });
    
    // Keyboard handler for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal) closeModal(activeModal);
      }
    });
  }

  // ----- Initialize -----
  function init() {
    initSwiper();
    initServiceFilters();
    initProjectModals();
    initCounters();
    initScrollReveal();
    initSmoothScroll();
    bindEvents();
    handleScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();