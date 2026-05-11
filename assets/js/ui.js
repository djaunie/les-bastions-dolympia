/**
 * ui.js — Comportements UI génériques mutualisables
 * Les Bastions d'Olympia — Horus Heresy Campaign
 *
 * Fonctions incluses :
 *   1. injectNav(config)           — injection dynamique de la barre de navigation commune
 *   2. Bascule thème clair/sombre  — gestion via [data-theme-toggle] et l’attribut data-theme sur <html>
 *   3. Menu mobile                 — contrôle de #nav-toggle et de aria-expanded
 *   4. Effet navbar scrollée       — ajout/retrait de .nav--scrolled en fonction du scroll
 *   5. Bouton retour en haut       — affichage du bouton #back-top après un certain défilement
 *   6. Reveal on scroll            — animation d’apparition des blocs .reveal (IntersectionObserver)
 *
 * Usage recommandé :
 *   <script src="assets/js/ui.js"></script>  ← actuellement sans defer car injectNav()
 *   est appelé dans un script inline à la fin du <body>. Si tu passes à defer,
 *   il faudra ajuster le bootstrap de la nav.
 */

// ── 1. INJECT NAV ─────────────────────────────────────────────────────────────

/**
 * Injecte la barre de navigation dans #nav-root.
 * - Remplace le nœud #nav-root par un <nav> complet construit en template string.
 * - Met en avant la page courante via classes CSS et aria-current.
 * - Peut afficher ou non le lien « Prochaine partie » selon la configuration.
 *
 * Utilisation côté HTML :
 *   <script>
 *     injectNav({ page: 'iron-warriors', showNextGame: false });
 *   </script>
 *
 * @param {Object}  config                - Paramètres de rendu de la nav.
 * @param {string}  config.page           - 'index'|'carte'|'bataille'|'iron-warriors'|'blood-angels'|'night-lords'.
 * @param {boolean} config.showNextGame   - Affiche le bouton « Prochaine partie » sur certaines pages.
 */
// eslint-disable-next-line no-unused-vars
function injectNav(config) {
  const root = document.getElementById('nav-root');
  if (!root) return;

  const logoHref = config.page === 'index' ? '#' : 'index.html';
  const isCarte = config.page === 'carte';
  const isBataille = config.page === 'bataille';

  const nextGameLink = config.showNextGame
    ? `<a href="bataille-1-anvillus.html"
          class="btn-nav-page btn-nav-page--carte${isBataille ? ' active' : ''}"
          aria-label="Description prochaine partie"
          ${isBataille ? 'aria-current="page"' : ''}>Prochaine partie</a>`
    : '';

  // Injection complète de la nav commune
  root.outerHTML = `
<nav class="nav" id="nav">
  <div class="nav-inner">

    <a href="${logoHref}" class="nav-logo" aria-label="Campagne Olympia — Iron Warriors">
      <svg class="nav-logo-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="8"   fill="none" stroke="#8a9bac" stroke-width="1.5"/>
        <circle cx="18" cy="18" r="3.5" fill="none" stroke="#c8a028" stroke-width="1.2"/>
        <rect x="16.5" y="7"  width="3" height="3" rx="0.5" fill="#8a9bac"/>
        <rect x="16.5" y="26" width="3" height="3" rx="0.5" fill="#8a9bac"/>
        <rect x="7"  y="16.5" width="3" height="3" rx="0.5" fill="#8a9bac"/>
        <rect x="26" y="16.5" width="3" height="3" rx="0.5" fill="#8a9bac"/>
        <line x1="14" y1="4"  x2="10" y2="10" stroke="#c8a028" stroke-width="1.2"/>
        <line x1="22" y1="4"  x2="18" y2="10" stroke="#c8a028" stroke-width="1.2"/>
      </svg>
      <div>
        <span class="nav-logo-text">Olympia</span>
        <span class="nav-logo-sub">Horus Heresy</span>
      </div>
    </a>

    <div class="nav-actions">
      <div class="nav-page-links">
        <a href="carte.html"
           class="btn-nav-page btn-nav-page--carte${isCarte ? ' active' : ''}"
           aria-label="Accéder à la carte"
           ${isCarte ? 'aria-current="page"' : ''}>Carte</a>
        ${nextGameLink}
      </div>
      <button class="btn-theme" data-theme-toggle aria-label="Basculer le thème"></button>
      <button class="nav-mobile-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>

  </div>
</nav>`;

  // Réinitialiser les comportements UI qui dépendent du DOM injecté
  // (le bouton de thème et le toggle mobile viennent d’être recréés)
  _initTheme();
  _initMobileMenu();
}

// ── INTERNALS ───────────────────────────────────────────────────────────────
// Les fonctions internes ci-dessous sont encapsulées dans un IIFE.
// Elles ne sont pas exposées directement, sauf _initTheme et _initMobileMenu
// qui sont ré-exportées sur window pour être rappelées par injectNav().

(function () {
  // ── 2. THEME TOGGLE ──────────────────────────────────────────────────────

  // Appliquer le thème immédiatement (avant rendu, évite le flash de thème).
  // On lit d’abord un éventuel data-theme existant, sinon on se base sur le media query système.
  const htmlEl = document.documentElement;
  let theme =
    htmlEl.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  htmlEl.setAttribute('data-theme', theme);

  /**
   * Met à jour l’icône et l’aria-label du bouton de thème.
   * - Choisit un pictogramme soleil/lune en fonction du thème courant.
   * - Met à jour le libellé ARIA pour annoncer le mode cible.
   */
  function _updateThemeBtn() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.innerHTML =
      theme === 'dark'
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute(
      'aria-label',
      `Basculer vers le mode ${  theme === 'dark' ? 'clair' : 'sombre'}`,
    );
  }

  /**
   * Initialise la gestion du thème.
   * - Met à jour le bouton existant (icône + aria-label).
   * - Remplace le bouton par un clone pour nettoyer d’éventuels anciens listeners.
   * - Ajoute un listener click pour basculer dark <-> light.
   */
  function _initTheme() {
    _updateThemeBtn();
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;

    // Cloner le bouton pour supprimer proprement les anciens listeners,
    // ce qui est nécessaire si la nav a été réinjectée.
    const freshBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(freshBtn, btn);

    freshBtn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', theme);
      _updateThemeBtn();
    });
  }

  // ── 3. MENU MOBILE ────────────────────────────────────────────────────────

  /**
   * Initialise le menu mobile.
   * - Cible le bouton #nav-toggle injecté dans la nav.
   * - Remplace le bouton par un clone pour nettoyer les vieux listeners.
   * - Bascule aria-expanded entre true/false à chaque clic.
   */
  function _initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    if (!toggle) return;

    const freshToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(freshToggle, toggle);

    freshToggle.addEventListener('click', () => {
      const expanded = freshToggle.getAttribute('aria-expanded') === 'true';
      freshToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ── 4. NAVBAR SCROLLÉE + 5. BOUTON RETOUR EN HAUT ────────────────────────

  // Un seul listener scroll gère à la fois :
  // - l’état "scrolled" de la nav (fond, ombre, etc.)
  // - la visibilité du bouton retour en haut (#back-top).
  window.addEventListener(
    'scroll',
    () => {
      const nav = document.getElementById('nav');
      const backTop = document.getElementById('back-top');
      if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 60);
      if (backTop) backTop.classList.toggle('visible', window.scrollY > 300);
    },
    { passive: true },
  );

  // ── 6. REVEAL ON SCROLL (IntersectionObserver) ────────────────────────────

  /**
   * Initialise l’animation d’apparition progressive des éléments .reveal.
   * - Utilise IntersectionObserver si disponible.
   * - Ajoute la classe .visible lorsqu’un élément entre dans le viewport.
   * - Désabonne chaque élément une fois révélé pour éviter le surcoût.
   */
  function _initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => obs.observe(el));
  }

  // Init au chargement du DOM
  // (le thème est appliqué le plus tôt possible en haut du script pour éviter les flashs).
  document.addEventListener('DOMContentLoaded', () => {
    // Si injectNav() n'a pas encore été appelé (ou si la nav est hardcodée),
    // on initialise tout de même thème, menu mobile et reveal.
    _initTheme();
    _initMobileMenu();
    _initReveal();
  });

  // Exposer certaines fonctions pour qu'injectNav() puisse les rappeler
  // après avoir réinjecté la nav dans le DOM.
  window._initTheme = _initTheme;
  window._initMobileMenu = _initMobileMenu;
})();
