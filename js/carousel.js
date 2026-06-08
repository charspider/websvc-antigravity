/* ============================================================
   CAROUSEL — Testimonials carousel with auto-play
   Optimizado: GPU compositing con will-change, pausa fuera del viewport.
   ============================================================ */

const Carousel = (() => {

  /* ---- State ---- */
  let currentSlide = 0;
  let totalSlides = 0;
  let autoPlayInterval = null;
  const AUTO_PLAY_DELAY = 6000; /* 6s: menos trabajo de layout */

  /* ---- DOM References ---- */
  let track = null;
  let dots = [];
  let btnPrev = null;
  let btnNext = null;

  /* ---- Core ---- */
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlide = index;
    /* Usar translateX con transform3d para forzar capa GPU */
    track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  /* ---- Auto-play ---- */
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  /* ---- Init ---- */
  function init() {
    track = document.getElementById('carousel-track');
    btnPrev = document.getElementById('carousel-prev');
    btnNext = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!track) return;

    totalSlides = track.children.length;

    /* Activar compositing GPU en el track */
    track.style.willChange = 'transform';

    if (dotsContainer) {
      dots = Array.from(dotsContainer.children);
    }

    if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); });
    });

    /* Pause on hover */
    const carouselEl = track.closest('.carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAutoPlay);
      carouselEl.addEventListener('mouseleave', startAutoPlay);

      /* Pausa también cuando el carousel sale del viewport */
      if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              startAutoPlay();
            } else {
              stopAutoPlay();
            }
          },
          { threshold: 0.1 }
        );
        visibilityObserver.observe(carouselEl);
      }
    }

    /* Touch swipe support */
    let touchStartX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    goToSlide(0);
    startAutoPlay();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Carousel.init);

