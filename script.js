/* ============================================
   NATHI PROJECTS - COMPLETE JAVASCRIPT v3
   Features: Dark Mode, Loader, Promo Banner,
   Calculator, Gallery Lightbox, FAQ Accordion,
   Progress Tracker, Before/After, Partners,
   WhatsApp Widget, Scroll to Top, Callback
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // LOADING SCREEN
  // ============================================
  function initLoader() {
    const loader = document.getElementById('loaderWrapper');
    if (!loader) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1500);
    });
  }

  // ============================================
  // DARK/LIGHT MODE TOGGLE
  // ============================================
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    if (!toggle || !icon) return;
    
    const savedTheme = localStorage.getItem('nathi-theme');
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
      icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      icon.textContent = prefersDark ? '☀️' : '🌙';
    }
    
    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('nathi-theme', newTheme);
    });
  }

  // ============================================
  // PROMO BANNER
  // ============================================
  function initPromoBanner() {
    const banner = document.getElementById('promoBanner');
    const closeBtn = document.getElementById('promoClose');
    if (!banner || !closeBtn) return;
    
    if (sessionStorage.getItem('promo-dismissed')) {
      banner.classList.add('hidden');
    }
    
    closeBtn.addEventListener('click', () => {
      banner.classList.add('hidden');
      sessionStorage.setItem('promo-dismissed', 'true');
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  let isMobileMenuOpen = false;
  
  function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', () => {
      isMobileMenuOpen = !isMobileMenuOpen;
      navLinks.classList.toggle('active', isMobileMenuOpen);
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    });
    
    navLinks.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        isMobileMenuOpen = false;
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    document.addEventListener('click', (e) => {
      if (isMobileMenuOpen && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
        isMobileMenuOpen = false;
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // STICKY HEADER
  // ============================================
  function initStickyHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ============================================
  // SWIPER INITIALIZATION
  // ============================================
  let servicesSwiper = null;
  let partnersSwiper = null;
  
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    
    servicesSwiper = new Swiper('#servicesSwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      speed: 500,
      pagination: { el: '#swiperPagination', clickable: true },
      navigation: { nextEl: '#swiperNext', prevEl: '#swiperPrev' },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 28 }
      }
    });
    
    partnersSwiper = new Swiper('#partnersSwiper', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      grabCursor: true,
      breakpoints: {
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 5 }
      }
    });
  }

  // ============================================
  // SERVICE FILTERS
  // ============================================
  function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.service-filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterSwiperSlides(this.getAttribute('data-category'));
      });
    });
  }
  
  function filterSwiperSlides(category) {
    const slides = document.querySelectorAll('#servicesSwiper .swiper-slide');
    slides.forEach(slide => {
      const slideCategory = slide.getAttribute('data-category');
      slide.style.display = (category === 'all' || slideCategory === category || slideCategory === 'all') ? '' : 'none';
    });
    if (servicesSwiper) {
      servicesSwiper.update();
      servicesSwiper.slideTo(0);
    }
  }

  // ============================================
  // PROJECT MODALS
  // ============================================
  function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card[data-project]');
    
    projectCards.forEach(card => {
      card.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const modal = document.getElementById(`modal-${projectId}`);
        if (modal) openModal(modal);
      });
    });
    
    document.querySelectorAll('.project-modal').forEach(modal => {
      modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
      modal.querySelector('.modal-overlay')?.addEventListener('click', () => closeModal(modal));
    });
    
    document.querySelectorAll('.modal-thumb').forEach(thumb => {
      thumb.addEventListener('click', function() {
        const mainImgSrc = this.getAttribute('data-main-img');
        const modalId = this.closest('.project-modal').id;
        const mainImg = document.getElementById(`modal-main-img-${modalId.replace('modal-', '')}`);
        if (mainImg && mainImgSrc) {
          mainImg.src = mainImgSrc;
          this.parentElement.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal) closeModal(activeModal);
      }
    });
  }
  
  function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close')?.focus();
  }
  
  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // ============================================
  // PHOTO GALLERY LIGHTBOX
  // ============================================
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!lightbox || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    const images = Array.from(galleryItems);
    
    function showImage(index) {
      const item = images[index];
      lightboxImage.src = item.getAttribute('data-src');
      lightboxImage.alt = item.getAttribute('data-caption');
      lightboxCaption.textContent = item.getAttribute('data-caption');
      lightboxCounter.textContent = `${index + 1} / ${images.length}`;
      currentIndex = index;
    }
    
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        showImage(index);
      });
    });
    
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('lightbox-open');
    });
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
      }
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });
    
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + images.length) % images.length; showImage(currentIndex); }
      else if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % images.length; showImage(currentIndex); }
      else if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.classList.remove('lightbox-open'); }
    });
  }

  // ============================================
  // PROJECT COST CALCULATOR
  // ============================================
  function initCalculator() {
    const form = document.getElementById('costCalculator');
    const resultDiv = document.getElementById('calcResult');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const whatsappBtn = document.getElementById('calcWhatsApp');
    if (!form || !resultDiv) return;
    
    const pricingData = {
      construction: { small: [50000, 150000], medium: [150000, 500000], large: [500000, 2000000] },
      renovation: { small: [30000, 80000], medium: [80000, 250000], large: [250000, 800000] },
      paving: { small: [15000, 35000], medium: [35000, 80000], large: [80000, 200000] },
      electrical: { small: [5000, 15000], medium: [15000, 40000], large: [40000, 100000] },
      plumbing: { small: [5000, 15000], medium: [15000, 40000], large: [40000, 100000] },
      roofing: { small: [10000, 30000], medium: [30000, 70000], large: [70000, 150000] }
    };
    
    const qualityMultiplier = { standard: 1, premium: 1.5, luxury: 2.5 };
    const serviceNames = { construction: 'New Construction', renovation: 'Renovation', paving: 'Paving', electrical: 'Electrical Work', plumbing: 'Plumbing', roofing: 'Roof Maintenance' };
    const sizeNames = { small: 'Small', medium: 'Medium', large: 'Large' };
    const qualityNames = { standard: 'Standard', premium: 'Premium', luxury: 'Luxury' };
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = document.getElementById('calcService').value;
      const size = document.getElementById('calcSize').value;
      const quality = document.getElementById('calcQuality').value;
      
      if (!service || !size || !quality) { alert('Please select all options.'); return; }
      
      const basePrice = pricingData[service]?.[size] || [0, 0];
      const multiplier = qualityMultiplier[quality] || 1;
      const min = Math.round(basePrice[0] * multiplier);
      const max = Math.round(basePrice[1] * multiplier);
      
      priceMin.textContent = `R${min.toLocaleString()}`;
      priceMax.textContent = `R${max.toLocaleString()}`;
      
      whatsappBtn.href = `https://wa.me/27672280060?text=${encodeURIComponent(
        `Hi Nathi Projects, I'd like an exact quote for:\n` +
        `• Service: ${serviceNames[service]}\n` +
        `• Size: ${sizeNames[size]}\n` +
        `• Quality: ${qualityNames[quality]}\n` +
        `• Estimated Range: R${min.toLocaleString()} - R${max.toLocaleString()}`
      )}`;
      
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-question')?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // ============================================
  // REQUEST CALLBACK
  // ============================================
  function initCallback() {
    const form = document.getElementById('callbackForm');
    if (!form) return;
    
    const timeNames = { morning: 'Morning (8am-12pm)', afternoon: 'Afternoon (12pm-4pm)', evening: 'Evening (4pm-6pm)' };
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cbName').value.trim();
      const phone = document.getElementById('cbPhone').value.trim();
      const time = document.getElementById('cbTime').value;
      const service = document.getElementById('cbService').value;
      
      if (!name || !phone) { alert('Please fill in your name and phone number.'); return; }
      
      window.open(`https://wa.me/27672280060?text=${encodeURIComponent(
        `Hi Nathi Projects, please call me back.\n` +
        `• Name: ${name}\n• Phone: ${phone}\n` +
        `• Preferred Time: ${timeNames[time] || 'Any time'}\n` +
        `• Service: ${service || 'Not specified'}`
      )}`, '_blank', 'noopener,noreferrer');
      
      form.reset();
      alert('Callback request sent! We\'ll contact you soon.');
    });
  }

  // ============================================
  // WHATSAPP CHAT WIDGET
  // ============================================
  function initWhatsAppWidget() {
    const widget = document.getElementById('whatsappWidget');
    const toggle = document.getElementById('waWidgetToggle');
    if (!widget || !toggle) return;
    
    toggle.addEventListener('click', () => widget.classList.toggle('open'));
    
    document.querySelectorAll('.wa-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.open(`https://wa.me/27672280060?text=${encodeURIComponent(btn.getAttribute('data-message'))}`, '_blank', 'noopener,noreferrer');
        widget.classList.remove('open');
      });
    });
    
    document.addEventListener('click', (e) => {
      if (widget.classList.contains('open') && !widget.contains(e.target) && !toggle.contains(e.target)) {
        widget.classList.remove('open');
      }
    });
  }

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.getAttribute('data-count'), 10), parseInt(el.getAttribute('data-duration'), 10) || 2000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
  }
  
  function animateCounter(element, target, duration) {
    const startTime = performance.now();
    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      element.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(updateCounter);
      else element.textContent = target;
    }
    requestAnimationFrame(updateCounter);
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.service-card, .about-card, .project-card, .testimonial-card, .contact-tile, ' +
      '.status-card, .gallery-item, .partner-card, .faq-item'
    );
    
    revealElements.forEach(el => el.classList.add('reveal'));
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    
    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (isMobileMenuOpen) {
            isMobileMenuOpen = false;
            document.getElementById('navLinks')?.classList.remove('active');
            document.body.style.overflow = '';
          }
          const headerHeight = document.getElementById('siteHeader')?.offsetHeight || 80;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================
  // WHATSAPP FORM (Contact Section)
  // ============================================
  function initWhatsAppForm() {
    const form = document.getElementById('whatsappForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('waName')?.value.trim();
      const service = document.getElementById('waService')?.value;
      const message = document.getElementById('waMessage')?.value.trim();
      
      let waMessage = 'Hello Nathi Projects,';
      if (name) waMessage += ` my name is ${name}.`;
      if (service) waMessage += ` I'm interested in: ${service}.`;
      if (message) waMessage += ` ${message}`;
      if (!name && !service && !message) waMessage += ' I would like to enquire about your services.';
      
      window.open(`https://wa.me/27672280060?text=${encodeURIComponent(waMessage)}`, '_blank', 'noopener,noreferrer');
      form.reset();
    });
  }

  // ============================================
  // FLOATING WHATSAPP HIDE NEAR FOOTER
  // ============================================
  function initFloatingWAHandler() {
    const floatingWA = document.getElementById('floatingWA');
    if (!floatingWA) return;
    
    window.addEventListener('scroll', () => {
      const footer = document.querySelector('.footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        floatingWA.style.opacity = footerTop < window.innerHeight + 100 ? '0' : '1';
        floatingWA.style.pointerEvents = footerTop < window.innerHeight + 100 ? 'none' : 'auto';
      }
    }, { passive: true });
  }

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  function init() {
    initLoader();
    initThemeToggle();
    initPromoBanner();
    initMobileMenu();
    initStickyHeader();
    initSwiper();
    initServiceFilters();
    initProjectModals();
    initLightbox();
    initCalculator();
    initFAQ();
    initCallback();
    initWhatsAppWidget();
    initScrollTop();
    initCounters();
    initScrollReveal();
    initSmoothScroll();
    initWhatsAppForm();
    initFloatingWAHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();