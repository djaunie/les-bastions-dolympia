/**
 * personnages-carousel.js
 * Carrousel de présentation des personnages — Campagne Olympia
 * Univers Iron Warriors / Warhammer Horus Heresy
 *
 * 100 % JavaScript vanilla — aucune dépendance externe.
 * Responsive • Accessible (clavier + ARIA) • Touch / swipe.
 * Les données sont chargées depuis campagne.json via l’événement CustomEvent 'campagne:ready'
 * émis par campagne.js → pas de double fetch et couplage faible avec le reste du front.
 *
 * Dépendances : utils.js (escapeHTML, escapeAttr) — doit être chargé avant ce script.
 */
(function () {
  'use strict';

  // SVG de repli utilisé lorsque l’image d’un personnage manque ou ne charge pas.
  const PLACEHOLDER_SVG =
    '<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="52" height="52" rx="2"/><path d="M4 40 l14-14 10 10 12-16 16 20"/><circle cx="42" cy="18" r="5"/></svg>';

  // ── Construction d’une slide ──────────────────────────────────────────────

  /**
   * Construit le HTML d'une diapositive du carrousel personnages.
   * - Gère l’image du personnage + un placeholder SVG en cas de visuel manquant.
   * - Prépare la partie texte : faction, nom, titre, ornement et paragraphe de lore.
   * - Ajoute les attributs ARIA pour que chaque slide soit annoncée correctement.
   * @param {Object} perso - Données du personnage (image, nom, titre, faction, lore).
   * @param {number} index - Index du personnage dans le tableau (0-based).
   * @param {number} total - Nombre total de personnages dans le carrousel.
   * @returns {string} HTML complet d'une diapositive <article>.
   */
  function buildSlide(perso, index, total) {
    // Bloc image + placeholder
    const imgHTML = [
      '<div class="perso-carousel__img-wrap">',
      '<img',
      '  class="perso-carousel__img"',
      `  src="${  perso.image || ''  }"`,
      `  alt="${  escapeAttr(perso.nom)  }"`,
      `  loading="${  index === 0 ? 'eager' : 'lazy'  }"`,
      '  width="860"',
      '  height="420"',
      `  data-perso-index="${  index  }"`,
      '>',
      `<div class="perso-carousel__img-placeholder" aria-hidden="true" style="display:${ 
        perso.image ? 'none' : 'flex' 
        }">`,
      PLACEHOLDER_SVG,
      '<span>Image non disponible</span>',
      '</div>',
      '</div>',
    ].join('');

    // Bloc texte (faction, nom, titre, lore)
    const bodyHTML = [
      '<div class="perso-carousel__body">',
      `<span class="perso-carousel__faction">${ 
        escapeHTML(perso.faction) 
        }</span>`,
      `<h3 class="perso-carousel__name">${  escapeHTML(perso.nom)  }</h3>`,
      `<p class="perso-carousel__title">${  escapeHTML(perso.titre)  }</p>`,
      '<div class="perso-carousel__ornament" aria-hidden="true"><span>&#9778; Dossier Inquisitorial &#9778;</span></div>',
      `<p class="perso-carousel__lore">${  escapeHTML(perso.lore)  }</p>`,
      '</div>',
    ].join('');

    // Slide complète avec rôle ARIA
    return [
      '<article',
      '  class="perso-carousel__slide"',
      '  role="group"',
      '  aria-roledescription="slide"',
      `  aria-label="${ 
        escapeAttr(perso.nom) 
        }, ${ 
        index + 1 
        } sur ${ 
        total 
        }"`,
      '>',
      imgHTML,
      bodyHTML,
      '</article>',
    ].join('');
  }

  // ── Injection du HTML du carrousel ────────────────────────────────────────

  /**
   * Injecte le carrousel complet de personnages dans un conteneur DOM.
   * - Construit la piste de slides, les boutons de navigation, la pagination et le compteur.
   * - Prépare tous les éléments nécessaires pour l’accessibilité (ARIA, roles).
   * @param {HTMLElement} section - Élément cible où injecter le carrousel.
   * @param {Array<Object>} personnages - Tableau des données des personnages.
   */
  function injectCarousel(section, personnages) {
    const total = personnages.length;

    // Slides <article> à partir des données
    const slidesHTML = personnages
      .map(function (p, i) {
        return buildSlide(p, i, total);
      })
      .join('');

    // Points de pagination
    const dotsHTML = personnages
      .map(function (p, i) {
        return [
          '<button',
          `  class="perso-carousel__dot${  i === 0 ? ' is-active' : ''  }"`,
          '  role="tab"',
          `  aria-label="${  escapeAttr(p.nom)  }"`,
          `  aria-selected="${  i === 0 ? 'true' : 'false'  }"`,
          `  data-perso-dot="${  i  }"`,
          '></button>',
        ].join('');
      })
      .join('');

    // Gabarit complet du carrousel
    section.innerHTML = [
      '<div class="perso-carousel" id="perso-carousel" role="region" aria-roledescription="carrousel" aria-label="Personnages de la campagne">',
      '<div class="perso-carousel__viewport" id="perso-carousel-viewport">',
      '<div class="perso-carousel__track" id="perso-carousel-track" aria-live="polite">',
      slidesHTML,
      '</div>',
      '</div>',
      '<button class="perso-carousel__btn perso-carousel__btn--prev" id="perso-btn-prev" aria-label="Personnage précédent" type="button">',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
      '</button>',
      '<button class="perso-carousel__btn perso-carousel__btn--next" id="perso-btn-next" aria-label="Personnage suivant" type="button">',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
      '</button>',
      '<div class="perso-carousel__pagination" role="tablist" aria-label="Navigation des personnages">',
      dotsHTML,
      '</div>',
      `<p class="perso-carousel__counter" aria-live="polite" aria-atomic="true" id="perso-counter">1 / ${ 
        total 
        }</p>`,
      '</div>',
    ].join('');
  }

  // ── Logique interactive ───────────────────────────────────────────────────

  /**
   * Initialise tous les comportements interactifs du carrousel.
   * - Navigation via les boutons précédent/suivant.
   * - Navigation via les points de pagination.
   * - Navigation clavier (↑, ↓, ←, →, Home, End).
   * - Support tactile (swipe) + drag à la souris.
   * - Gestion du placeholder si une image échoue à se charger.
   */
  function initLogic() {
    const carousel = document.getElementById('perso-carousel');
    const viewport = document.getElementById('perso-carousel-viewport');
    const track = document.getElementById('perso-carousel-track');
    const btnPrev = document.getElementById('perso-btn-prev');
    const btnNext = document.getElementById('perso-btn-next');
    const counter = document.getElementById('perso-counter');
    const dots = Array.from(document.querySelectorAll('[data-perso-dot]'));
    const slides = Array.from(track.querySelectorAll('.perso-carousel__slide'));
    const total = slides.length;
    if (!total) return;

    let current = 0;

    // Variables pour swipe / drag
    let touchStartX = null;
    let touchStartY = null;
    const SWIPE_THRESH = 50;
    let mouseStartX = null;
    let isDragging = false;

    // Gestion placeholder image manquante
    slides.forEach(function (slide) {
      const img = slide.querySelector('.perso-carousel__img');
      const placeholder = slide.querySelector(
        '.perso-carousel__img-placeholder',
      );
      if (!img) return;
      img.addEventListener('error', function () {
        img.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
      });
    });

    /**
     * Va à la slide demandée et met à jour tous les indicateurs.
     * @param {number} index - Index cible (peut être hors bornes, on boucle).
     * @param {boolean} [announce] - Si false, on saute la mise à jour si pas de changement.
     */
    function goTo(index, announce) {
      // Bouclage circulaire
      index = ((index % total) + total) % total;
      if (index === current && announce === false) return;

      current = index;

      // Déplacement de la piste
      track.style.transform = `translateX(-${  current * 100  }%)`;

      // Mise à jour des points de pagination
      dots.forEach(function (dot, i) {
        const active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      // Mise à jour du compteur textuel
      if (counter) counter.textContent = `${current + 1  } / ${  total}`;

      // Mise à jour ARIA des slides (aria-hidden)
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
      });
    }

    // Masque toutes les slides sauf la première
    slides.forEach(function (slide, i) {
      if (i !== 0) slide.setAttribute('aria-hidden', 'true');
    });

    // Boutons précédent / suivant
    btnPrev.addEventListener('click', function () {
      goTo(current - 1);
    });
    btnNext.addEventListener('click', function () {
      goTo(current + 1);
    });

    // Points de pagination
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-perso-dot'), 10));
      });
    });

    // Navigation clavier sur tout le carrousel (zone focusable)
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(current - 1);
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goTo(current + 1);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        goTo(total - 1);
      }
    });

    // S’assure que le carrousel peut recevoir le focus clavier
    if (!carousel.hasAttribute('tabindex'))
      carousel.setAttribute('tabindex', '0');

    // Gestion du swipe tactile
    viewport.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );

    viewport.addEventListener(
      'touchend',
      function (e) {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;

        // Si le mouvement est majoritairement vertical, on ne l’interprète pas comme un swipe.
        if (Math.abs(dy) > Math.abs(dx)) {
          touchStartX = null;
          return;
        }

        if (dx < -SWIPE_THRESH) goTo(current + 1);
        else if (dx > SWIPE_THRESH) goTo(current - 1);

        touchStartX = null;
      },
      { passive: true },
    );

    // Drag à la souris (desktop)
    viewport.addEventListener('mousedown', function (e) {
      mouseStartX = e.clientX;
      isDragging = false;
      viewport.classList.add('perso-carousel__viewport--dragging');
    });

    window.addEventListener('mousemove', function (e) {
      if (mouseStartX === null) return;
      if (Math.abs(e.clientX - mouseStartX) > 5) isDragging = true;
    });

    window.addEventListener('mouseup', function (e) {
      if (mouseStartX === null) return;
      const dx = e.clientX - mouseStartX;

      if (isDragging) {
        if (dx < -SWIPE_THRESH) goTo(current + 1);
        else if (dx > SWIPE_THRESH) goTo(current - 1);
      }

      mouseStartX = null;
      isDragging = false;
      viewport.classList.remove('perso-carousel__viewport--dragging');
    });

    // Empêche le drag natif des images (sinon conflit avec le drag du carrousel)
    track.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
    });
  }

  // ── Point d'entrée : écoute l'événement émis par campagne.js ─────────────

  /**
   * Point d'entrée principal — initialise le carrousel personnages.
   * - Injecte le HTML du carrousel dans le conteneur cible.
   * - Puis branche toute la logique interactive (clavier, souris, tactile).
   * @param {Array<Object>} personnages - Tableau des données de personnages.
   */
  function init(personnages) {
    const target = document.getElementById('perso-carousel-container');
    if (!target || !personnages.length) return;
    injectCarousel(target, personnages);
    initLogic();
  }

  // Écoute l’événement 'campagne:ready' émis par campagne.js
  // et initialise le carrousel dès que les données sont disponibles.
  document.addEventListener('campagne:ready', function (e) {
    init(e.detail.personnages || []);
  });
})();
