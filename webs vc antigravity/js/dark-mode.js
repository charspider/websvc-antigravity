/* ============================================================
   DARK MODE — Theme toggle with localStorage persistence
   ============================================================ */

const DarkMode = (() => {

  const STORAGE_KEY = 'websvc-theme';

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function init() {
    /* Load saved preference or fall back to system preference */
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const theme = savedTheme || getSystemPreference();
    setTheme(theme);

    /* Bind toggle buttons */
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    /* Listen for system preference changes */
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  return { init, toggleTheme, setTheme };
})();

document.addEventListener('DOMContentLoaded', DarkMode.init);
