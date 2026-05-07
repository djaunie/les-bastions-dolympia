// assets/js/ui.js — fichier UNIQUE qui gère thème + scroll

window.OlympiaUI = (function () {

  // ── THÈME ──────────────────────────────────────────────────────
  const root    = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  let theme = root.getAttribute('data-theme')
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function _updateThemeBtn() {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label',
      theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    // met à jour l'icône si besoin
  }

  function initTheme() {
    root.setAttribute('data-theme', theme);
    _updateThemeBtn();
    themeBtn?.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      _updateThemeBtn();
    });
  }

  // ── SCROLL NAVBAR ──────────────────────────────────────────────
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () =>
      nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // état initial
  }

  // ── REVEAL (IntersectionObserver) ──────────────────────────────
  function initReveal(threshold = 0.1) {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold }
    );
    items.forEach(el => obs.observe(el));
  }

  // ── INIT AUTO ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavScroll();
    initReveal();
  });

  // API publique (optionnelle, pour appels depuis campagne.js)
  return { initReveal };

})();
