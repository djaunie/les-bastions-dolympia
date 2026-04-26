/**
 * ui.js — Fonctions UI communes à toutes les pages
 * Les Bastions d'Olympia — Horus Heresy
 *
 * Contient :
 *  - Theme Toggle (clair / sombre)
 *  - Mobile Nav toggle
 *  - Nav scroll + Back-to-Top
 *  - Reveal on Scroll (IntersectionObserver)
 */

(function () {

  // ── THEME TOGGLE ────────────────────────────────────────────────────────────
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = root.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  function updateThemeBtn() {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === 'dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeBtn.setAttribute(
      'aria-label',
      'Basculer vers le mode ' + (theme === 'dark' ? 'clair' : 'sombre')
    );
  }

  updateThemeBtn();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateThemeBtn();
    });
  }

  // ── MOBILE NAV ──────────────────────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ── NAV SCROLL + BACK-TO-TOP ────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const backTop = document.getElementById('back-top');

  if (nav || backTop) {
    window.addEventListener('scroll', () => {
      if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 60);
      if (backTop) backTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
  }

  // ── REVEAL ON SCROLL ────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => obs.observe(el));
  }

})();
