/* ============================================================
   VENTRYX — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // --- AOS Init ---
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'phone'
          : false,
      });
    }

    initNavbar();
    initMobileMenu();
    initFAQ();
    initIndustryTabs();
    initCounters();
    initScrollTop();
    initStickyNav();
    initDemoForm();
    initPricingToggle();
  });

  // --- Sticky Navbar ---
  function initStickyNav() {
    var navbar = document.querySelector('.vx-navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    var toggle = document.querySelector('.vx-mobile-toggle');
    var mobileNav = document.querySelector('.vx-mobile-nav');
    var body = document.body;
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        toggle.innerHTML = '<i class="bi bi-list"></i>';
        body.style.overflow = '';
      } else {
        mobileNav.classList.add('open');
        toggle.innerHTML = '<i class="bi bi-x-lg"></i>';
        body.style.overflow = 'hidden';
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.innerHTML = '<i class="bi bi-list"></i>';
        body.style.overflow = '';
      });
    });
  }

  // --- Navbar active link ---
  function initNavbar() {
    var currentPath = window.location.pathname;
    document.querySelectorAll('.vx-nav-links a').forEach(function (link) {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // --- FAQ Accordion ---
  function initFAQ() {
    document.querySelectorAll('.vx-faq-question').forEach(function (question) {
      question.addEventListener('click', function () {
        var item = question.closest('.vx-faq-item');
        var isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.vx-faq-item').forEach(function (el) {
          el.classList.remove('open');
        });

        // Toggle clicked
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // --- Industry Tabs ---
  function initIndustryTabs() {
    var tabs = document.querySelectorAll('.vx-industry-tab');
    var contents = document.querySelectorAll('.vx-industry-content');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.tab;

        tabs.forEach(function (t) { t.classList.remove('active'); });
        contents.forEach(function (c) { c.classList.remove('active'); });

        tab.classList.add('active');
        var content = document.getElementById('tab-' + target);
        if (content) content.classList.add('active');
      });
    });
  }

  // --- Counter Animation ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var current = Math.floor(eased * target);

      if (target % 1 !== 0) {
        current = (eased * target).toFixed(1);
      }

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // --- Scroll to Top ---
  function initScrollTop() {
    var btn = document.querySelector('.vx-scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Demo Form ---
  function initDemoForm() {
    var forms = document.querySelectorAll('.vx-demo-form, .vx-contact-form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var original = btn ? btn.innerHTML : '';

        if (btn) {
          btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Submitted!';
          btn.disabled = true;
          btn.style.background = '#10B981';
        }

        var successMsg = form.querySelector('.vx-form-success');
        if (successMsg) {
          successMsg.style.display = 'block';
        }

        setTimeout(function () {
          if (btn) {
            btn.innerHTML = original;
            btn.disabled = false;
            btn.style.background = '';
          }
          form.reset();
          if (successMsg) successMsg.style.display = 'none';
        }, 4000);
      });
    });
  }

  // --- Pricing Toggle (Monthly/Annual) ---
  function initPricingToggle() {
    var toggle = document.getElementById('pricing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', function () {
      var isAnnual = toggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        var monthly = parseInt(el.dataset.monthly, 10);
        var annual = Math.floor(monthly * 0.80);
        el.textContent = isAnnual ? annual : monthly;
      });
      var periodEls = document.querySelectorAll('.vx-price-period-text');
      periodEls.forEach(function (el) {
        el.textContent = isAnnual ? 'per user / month (billed annually)' : 'per user / month';
      });
      var savingsEl = document.getElementById('annual-savings-badge');
      if (savingsEl) {
        savingsEl.style.display = isAnnual ? 'inline-flex' : 'none';
      }
    });
  }

  // --- Smooth anchor scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
