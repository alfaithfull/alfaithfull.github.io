/**
 * WebSysDev — Main JavaScript
 * Handles: navigation scroll effect, mobile menu, smooth scroll,
 *          scroll-triggered animations, and footer year.
 */

(function () {
  'use strict';

  /* ── Utility: run after DOM ready ── */
  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /* ── 1. Header scroll state ─────────────────────────────── */
  function initScrollHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    /* Add/remove "scrolled" class based on window position */
    function updateHeader() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); /* run once on load */
  }

  /* ── 2. Mobile menu toggle ──────────────────────────────── */
  function initMobileMenu() {
    var toggle = document.getElementById('nav-toggle');
    var menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);

      /* Accessibility attributes */
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    /* Close menu when any mobile link is clicked */
    var mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ── 3. Smooth scroll for anchor links ─────────────────── */
  function initSmoothScroll() {
    /* The CSS scroll-behavior: smooth handles most cases,
       but we add offset correction for the fixed header here */
    var headerEl = document.getElementById('site-header');

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var headerHeight = headerEl ? headerEl.offsetHeight : 0;
        var targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top:      targetTop,
          behavior: 'smooth'
        });

        /* Update URL hash without jump */
        history.pushState(null, '', targetId);
      });
    });
  }

  /* ── 4. Scroll-triggered reveal for experience blocks ───── */
  function initScrollReveal() {
    var blocks = document.querySelectorAll('[data-animate]');
    if (!blocks.length) return;

    /* Use IntersectionObserver for performance */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            /* Stagger delay based on element index within parent */
            var siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-animate]'));
            var index    = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (index * 80) + 'ms';
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); /* only animate once */
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      blocks.forEach(function (el) { observer.observe(el); });

    } else {
      /* Fallback: show all immediately for unsupported browsers */
      blocks.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ── 5. Footer year (auto-update) ──────────────────────── */
  function initFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* ── 6. Active nav link highlight on scroll ─────────────── */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    var headerEl = document.getElementById('site-header');

    function updateActive() {
      var scrollPos    = window.scrollY;
      var headerHeight = headerEl ? headerEl.offsetHeight : 0;
      var activeId     = null;

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop - headerHeight - 80;
        if (scrollPos >= sectionTop) {
          activeId = section.id;
        }
      });

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === activeId);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ── Initialise everything ──────────────────────────────── */
  onReady(function () {
    initScrollHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initFooterYear();
    initActiveNav();
  });

})();
