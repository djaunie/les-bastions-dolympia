/**
 * personnages-carousel.js
 * Carrousel de présentation des personnages — Campagne Fyrentis
 * Univers World Eaters / Warhammer 40K
 *
 * 100 % JavaScript vanilla — aucune dépendance externe
 * Responsive • Accessible (clavier + ARIA) • Touch/swipe
 * Gère les images manquantes avec un placeholder élégant
 */
(function () {
  'use strict';

  /* ── Données des personnages ────────────────────────────────────────────
   * Chaque objet contient :
   *   nom      : string  — nom affiché
   *   titre    : string  — rôle / épithète
   *   faction  : string  — étiquette faction (badge)
   *   image    : string  — chemin relatif depuis la racine du site
   *   lore     : string  — description narrative
   * ─────────────────────────────────────────────────────────────────────*/
  var PERSONNAGES = [
    {
      nom:     'Perturabo',
      titre:   'Primarque des Iron Warriors',
      faction: 'Iron Warriors · Primarque',
      image:   'assets/img/personnages/angron.jpg',
      lore:    'Perturabo est le Primarque de la IVe Légion, les Iron Warriors, génie froid de l’ingénierie et des sièges. Calculateur et méthodique, il conçoit la guerre comme un problème à résoudre par la logique, l’artillerie et la géométrie parfaite du massacre.

Toute sa vie, il se sentit sous‑estimé par l’Empereur et méprisé par ses frères, relégué aux campagnes les plus ingrates alors qu’il se pensait indispensable. Ce ressentiment rongea peu à peu son esprit, nourrissant amertume, jalousie et paranoïa, jusqu’à le pousser vers la trahison.

Lors de l’Hérésie d’Horus, Perturabo mit ses Iron Warriors au service du Maître de Guerre, brisant les forteresses de l’Imperium avec une précision impitoyable. Devenu l’incarnation de la destruction assiégeante, il laissa derrière lui des mondes réduits à des carcasses de béton et d’acier, gravant à jamais son nom dans la légende la plus sombre de l’Adeptus Astartes.'
    },
    {
      nom:     'Angron',
      titre:   'Primarque des World Eaters',
      faction: 'World Eaters · Primarque',
      image:   'assets/img/personnages/angron.jpg',
      lore:    'Angron naquit dans la boue rouge de Nuceria et ne connut jamais que la chaîne, le fouet et le cri des arènes. Les clous du boucher martelèrent son crâne jusqu’à ce que toute pensée devienne douleur, et que seule la guerre apaise le tumulte. Quand il mena ses gladiateurs vers une dernière révolte, l’Empereur le vola à son unique victoire, et la rancœur d’Angron hurle encore à travers les vox, noyée dans le rugissement des canons du Conqueror. Aujourd’hui, il est plus qu’un primarque : il est un ouragan de sang qui cherche, dans chaque massacre, un instant de silence intérieur. Dans ses rares moments de lucidité, il craint de ne plus se souvenir du visage de ses frères d’arène. Certains World Eaters jurent entendre Angron murmurer des noms de gladiateurs morts, comme s’il les cherchait encore dans le Warp.'
    },
    {
      nom:     'Sanguinius',
      titre:   'Primarque des Blood Angels',
      faction: 'Blood Angels',
      image:   'assets/img/personnages/kharak.jpg',
      lore:    'Sanguinius est le sublime Primarque de la IXe Légion, les Blood Angels, un être à l’allure d’ange dont la grâce masque une puissance guerrière terrifiante. Né sur Baal Secundus, il fut vénéré comme un sauveur par des survivants qui acceptèrent ses ailes plutôt que de le craindre. Lorsque l’Empereur le retrouva, il lui confia la IXe Légion, qui prit le nom de Blood Angels et devint un symbole d’espoir pour l’Imperium.

Chef charismatique, stratège brillant et parangon de noblesse, Sanguinius portait pourtant une tare génétique : la Soif Rouge, pulsion sanguinaire qu’il tenta de contenir pour préserver l’honneur de ses fils. Durant la Grande Croisade puis l’Hérésie d’Horus, il combattit sans relâche jusqu’au Siège de Terra, où il affronta Horus lui‑même et mourut en martyr. Sa mort et son sacrifice hantent encore tous les descendants des Blood Angels.'
    }
  ];

  /* ── SVG placeholder affiché quand une image est manquante ─────────── */
  var PLACEHOLDER_SVG = '<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="52" height="52" rx="2"/><path d="M4 40 l14-14 10 10 12-16 16 20"/><circle cx="42" cy="18" r="5"/></svg>';

  /* ── Construire le HTML d\'un slide ───────────────────────────────────── */
  function buildSlide(perso, index, total) {
    var imgHTML = [
      '<div class="perso-carousel__img-wrap">',
        '<img',
        '  class="perso-carousel__img"',
        '  src="' + perso.image + '"',
        '  alt="' + escapeAttr(perso.nom) + '"',
        '  loading="' + (index === 0 ? 'eager' : 'lazy') + '"',
        '  width="860"',
        '  height="420"',
        '  data-perso-index="' + index + '"',
        '>',
        '<div class="perso-carousel__img-placeholder" aria-hidden="true" style="display:none">',
          PLACEHOLDER_SVG,
          '<span>Image non disponible</span>',
        '</div>',
      '</div>'
    ].join('');

    var bodyHTML = [
      '<div class="perso-carousel__body">',
        '<span class="perso-carousel__faction">' + escapeHTML(perso.faction) + '</span>',
        '<h3 class="perso-carousel__name">' + escapeHTML(perso.nom) + '</h3>',
        '<p class="perso-carousel__title">' + escapeHTML(perso.titre) + '</p>',
        '<div class="perso-carousel__ornament" aria-hidden="true"><span>&#9778; Dossier Inquisitorial &#9778;</span></div>',
        '<p class="perso-carousel__lore">' + escapeHTML(perso.lore) + '</p>',
      '</div>'
    ].join('');

    return [
      '<article',
      '  class="perso-carousel__slide"',
      '  role="group"',
      '  aria-roledescription="slide"',
      '  aria-label="' + escapeAttr(perso.nom) + ', ' + (index + 1) + ' sur ' + total + '"',
      '>',
        imgHTML,
        bodyHTML,
      '</article>'
    ].join('');
  }

  /* ── Utilitaires d\'échappement ─────────────────────────────────────── */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ── Injection HTML dans la section ────────────────────────────────── */
  function injectCarousel(section) {
    var total = PERSONNAGES.length;

    // Construire les slides
    var slidesHTML = PERSONNAGES.map(function (p, i) {
      return buildSlide(p, i, total);
    }).join('');

    // Construire les dots de pagination
    var dotsHTML = PERSONNAGES.map(function (p, i) {
      return [
        '<button',
        '  class="perso-carousel__dot' + (i === 0 ? ' is-active' : '') + '"',
        '  role="tab"',
        '  aria-label="' + escapeAttr(p.nom) + '"',
        '  aria-selected="' + (i === 0 ? 'true' : 'false') + '"',
        '  data-perso-dot="' + i + '"',
        '></button>'
      ].join('');
    }).join('');

    section.innerHTML = [
      '<div class="perso-carousel" id="perso-carousel" role="region" aria-roledescription="carrousel" aria-label="Personnages de la campagne">',

        '<!-- Viewport + piste de slides -->',
        '<div class="perso-carousel__viewport" id="perso-carousel-viewport">',
          '<div class="perso-carousel__track" id="perso-carousel-track" aria-live="polite">',
            slidesHTML,
          '</div>',
        '</div>',

        '<!-- Bouton précédent -->',
        '<button class="perso-carousel__btn perso-carousel__btn--prev" id="perso-btn-prev" aria-label="Personnage précédent" type="button">',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
        '</button>',

        '<!-- Bouton suivant -->',
        '<button class="perso-carousel__btn perso-carousel__btn--next" id="perso-btn-next" aria-label="Personnage suivant" type="button">',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
        '</button>',

        '<!-- Pagination (dots) -->',
        '<div class="perso-carousel__pagination" role="tablist" aria-label="Navigation des personnages">',
          dotsHTML,
        '</div>',

        '<!-- Compteur textuel -->',
        '<p class="perso-carousel__counter" aria-live="polite" aria-atomic="true" id="perso-counter">1 / ' + total + '</p>',

      '</div>'
    ].join('');
  }

  /* ── Logique du carrousel ───────────────────────────────────────────── */
  function initLogic() {
    var carousel  = document.getElementById('perso-carousel');
    var viewport  = document.getElementById('perso-carousel-viewport');
    var track     = document.getElementById('perso-carousel-track');
    var btnPrev   = document.getElementById('perso-btn-prev');
    var btnNext   = document.getElementById('perso-btn-next');
    var counter   = document.getElementById('perso-counter');
    var dots      = Array.from(document.querySelectorAll('[data-perso-dot]'));
    var slides    = Array.from(track.querySelectorAll('.perso-carousel__slide'));
    var total     = slides.length;
    if (!total) return;

    var current  = 0;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Gestion des images manquantes ───────────────────────────────── */
    slides.forEach(function (slide) {
      var img = slide.querySelector('.perso-carousel__img');
      var placeholder = slide.querySelector('.perso-carousel__img-placeholder');
      if (!img) return;
      img.addEventListener('error', function () {
        img.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
      });
    });

    /* ── Aller à un slide donné ───────────────────────────────────────── */
    function goTo(index, announce) {
      // Normalisation circulaire
      index = ((index % total) + total) % total;
      if (index === current && announce === false) return;

      current = index;

      // Déplacer la piste
      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      // Mettre à jour les dots
      dots.forEach(function (dot, i) {
        var active = (i === current);
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      // Mettre à jour le compteur
      if (counter) counter.textContent = (current + 1) + ' / ' + total;

      // Mettre à jour aria-live du slide courant
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
      });
    }

    // Init : masquer les slides non actifs pour les lecteurs d\'écran
    slides.forEach(function (slide, i) {
      if (i !== 0) slide.setAttribute('aria-hidden', 'true');
    });

    /* ── Boutons précédent / suivant ─────────────────────────────────── */
    btnPrev.addEventListener('click', function () { goTo(current - 1); });
    btnNext.addEventListener('click', function () { goTo(current + 1); });

    /* ── Dots de pagination ───────────────────────────────────────────── */
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-perso-dot'), 10));
      });
    });

    /* ── Navigation clavier ──────────────────────────────────────────── */
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      if (e.key === 'End')  { e.preventDefault(); goTo(total - 1); }
    });

    // Rendre le carousel focusable pour la navigation clavier
    if (!carousel.hasAttribute('tabindex')) carousel.setAttribute('tabindex', '0');

    /* ── Swipe tactile ───────────────────────────────────────────────── */
    var touchStartX  = null;
    var touchStartY  = null;
    var SWIPE_THRESH = 50; // pixels minimum pour déclencher

    viewport.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      // Ignorer si le scroll vertical est dominant
      if (Math.abs(dy) > Math.abs(dx)) { touchStartX = null; return; }
      if (dx < -SWIPE_THRESH) goTo(current + 1);
      else if (dx > SWIPE_THRESH) goTo(current - 1);
      touchStartX = null;
    }, { passive: true });

    /* ── Drag souris (desktop) ───────────────────────────────────────── */
    var mouseStartX = null;
    var isDragging  = false;

    viewport.addEventListener('mousedown', function (e) {
      mouseStartX = e.clientX;
      isDragging  = false;
      viewport.classList.add('perso-carousel__viewport--dragging');
    });

    window.addEventListener('mousemove', function (e) {
      if (mouseStartX === null) return;
      if (Math.abs(e.clientX - mouseStartX) > 5) isDragging = true;
    });

    window.addEventListener('mouseup', function (e) {
      if (mouseStartX === null) return;
      var dx = e.clientX - mouseStartX;
      if (isDragging) {
        if (dx < -SWIPE_THRESH) goTo(current + 1);
        else if (dx > SWIPE_THRESH) goTo(current - 1);
      }
      mouseStartX = null;
      isDragging  = false;
      viewport.classList.remove('perso-carousel__viewport--dragging');
    });

    // Éviter le drag des images
    track.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('dragstart', function (e) { e.preventDefault(); });
    });
  }

  /* ── Point d\'entrée principal ─────────────────────────────────────── */
  function init() {
    // Chercher le conteneur cible injecté dans index.html
    var target = document.getElementById('perso-carousel-container');
    if (!target) return; // Section absente, ne rien faire

    // Injecter le HTML du carrousel
    injectCarousel(target);

    // Initialiser la logique interactive
    initLogic();
  }

  /* ── Lancement après le DOM ─────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
