/* ============================================================
   CAROUSEL — Testimonials carousel with auto-play
   ============================================================ */

const Carousel = (() => {

  /* ---- State ---- */
  let currentSlide = 0;
  let totalSlides = 0;
  let autoPlayInterval = null;
  const AUTO_PLAY_DELAY = 5000;

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
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

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
    }

    /* Touch swipe support */
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
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
