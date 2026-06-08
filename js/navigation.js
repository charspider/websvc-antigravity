/* ============================================================
   NAVIGATION — Sticky navbar, hamburger menu, smooth scroll
   ============================================================ */

const Navigation = (() => {
  /* ---- DOM References ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navbar-hamburger');
  const mobileOverlay = document.getElementById('navbar-mobile-overlay');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  /* ---- State ---- */
  const SCROLL_THRESHOLD = 50;

  /* ---- Navbar scroll behaviour (rAF throttled) ---- */
  let scrollTicking = false;

  function updateNavbarState() {
    if (!navbar) return;
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;
    navbar.classList.toggle('is-scrolled', isScrolled);
    scrollTicking = false;
  }

  function handleScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(updateNavbarState);
      scrollTicking = true;
    }
  }

  /* ---- Hamburger toggle ---- */
  function toggleMobileMenu() {
    if (!hamburger || !mobileOverlay) return;

    const isActive = hamburger.classList.toggle('is-active');
    mobileOverlay.classList.toggle('is-active', isActive);
    document.body.classList.toggle('menu-open', isActive);

    hamburger.setAttribute('aria-expanded', String(isActive));
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileOverlay) return;
    hamburger.classList.remove('is-active');
    mobileOverlay.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  /* ---- Smooth scroll to section ---- */
  function scrollToSection(event) {
    const targetId = event.currentTarget.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    closeMobileMenu();

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- Init ---- */
  function init() {
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateNavbarState(); /* Set initial state synchronously */

    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', scrollToSection);
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Navigation.init);
