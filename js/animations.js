/* ============================================================
   ANIMATIONS — IntersectionObserver fade-in + animated counters
   Optimizado para rendimiento: thresholds agresivos, reduced-motion.
   ============================================================ */

const Animations = (() => {

  /* Respeta preferencia del usuario de reducir movimiento */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Fade-in on scroll ---- */
  function initFadeIn() {
    const elements = document.querySelectorAll('.fade-in-element');
    if (elements.length === 0) return;

    /* Si el usuario prefiere sin movimiento, mostrar todo inmediatamente */
    if (prefersReducedMotion) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
      return;
    }

    /* Mostrar los elementos del hero inmediatamente sin esperar scroll */
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.querySelectorAll('.fade-in-element').forEach(el => {
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
        });
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    /* Solo observar elementos fuera del hero (ya se muestran arriba) */
    elements.forEach(el => {
      if (!heroSection || !heroSection.contains(el)) {
        observer.observe(el);
      }
    });
  }

  /* ---- Animated counters ---- */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = prefersReducedMotion ? 0 : 1400;

    if (duration === 0) {
      element.textContent = prefix + target + suffix;
      return;
    }

    const startTime = performance.now();

    function easeOutExpo(progress) {
      return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.round(easedProgress * target);

      element.textContent = prefix + currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(counter => observer.observe(counter));
  }

  /* ---- Init ---- */
  function init() {
    initFadeIn();
    initCounters();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Animations.init);
