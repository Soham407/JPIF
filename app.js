// Shared portal behavior: accessible mobile navigation toggle.
(function () {
  function closeNav() {
    var nav = document.getElementById('primary-nav');
    var toggle = document.querySelector('.nav-toggle');
    if (nav) nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.nav-dropdown-menu').forEach(function (m) {
      m.classList.remove('is-open');
    });
    document.querySelectorAll('.nav-dropdown-toggle').forEach(function (t) {
      t.classList.remove('is-active');
    });
  }

  // Shrink the sticky header once the page scrolls away from the top.
  // rAF-throttled + passive so the handler never blocks scrolling.
  var header = document.querySelector('.topnav');
  if (header) {
    var progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '2.5px';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = 'var(--accent-text)';
    progressBar.style.transition = 'width 0.1s ease-out';
    progressBar.style.willChange = 'width';
    header.appendChild(progressBar);

    var ticking = false;
    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';

      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  document.addEventListener('click', function (e) {
    var dropdownToggle = e.target.closest('.nav-dropdown-toggle');
    if (dropdownToggle && window.innerWidth <= 980) {
      e.preventDefault();
      var dropdown = dropdownToggle.closest('.nav-dropdown');
      var menu = dropdown.querySelector('.nav-dropdown-menu');
      if (menu) {
        var isOpen = menu.classList.toggle('is-open');
        dropdownToggle.classList.toggle('is-active', isOpen);
      }
      return;
    }

    var toggle = e.target.closest('.nav-toggle');
    if (toggle) {
      var nav = document.getElementById('primary-nav');
      if (!nav) return;
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    // A link inside the open menu was followed: collapse it.
    if (e.target.closest('#primary-nav a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var nav = document.getElementById('primary-nav');
    if (nav && nav.classList.contains('is-open')) {
      closeNav();
      var toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.focus();
    }
  });

  // Intersection Observer for scroll entrance animations (flicker-free)
  document.addEventListener('DOMContentLoaded', function () {
    var selectorsToAnimate = '.section-head, .card, .sector-card, .service-card, .level-card, .journey-step-card, .coordinator-card';
    
    // Prevent animation flash (FOUC) on page load by checking viewport state before adding animate class
    document.querySelectorAll(selectorsToAnimate).forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (inViewport) {
        el.classList.add('is-visible');
      } else {
        el.classList.add('animate-on-scroll');
      }
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

      document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        observer.observe(el);
      });
    } else {
      document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    // Intersection Observer for background section ornaments
    var ornamentSelectors = '.decor-left, .decor-right';
    document.querySelectorAll(ornamentSelectors).forEach(function (el) {
      el.classList.add('decor-animate');
      var rect = el.getBoundingClientRect();
      var inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        el.classList.add('decor-visible');
      }
    });

    if ('IntersectionObserver' in window) {
      var ornamentObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('decor-visible');
          } else {
            entry.target.classList.remove('decor-visible');
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll(ornamentSelectors).forEach(function (el) {
        ornamentObserver.observe(el);
      });
    } else {
      document.querySelectorAll(ornamentSelectors).forEach(function (el) {
        el.classList.add('decor-visible');
      });
    }
  });
})();
