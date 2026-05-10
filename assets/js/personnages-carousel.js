/**
 * personnages-carousel.js
 * Carrousel de présentation des personnages — Campagne Olympia
 * Univers Iron Warriors / Warhammer Horus Heresy
 *
 * 100 % JavaScript vanilla — aucune dépendance externe
 * Responsive • Accessible (clavier + ARIA) • Touch/swipe
 * Gère les images manquantes avec un placeholder élégant
 */
(function () {
  'use strict';

  const PERSONNAGES = [
    {
      nom: 'Perturabo',
      titre: 'Primarque des Iron Warriors',
      faction: 'Iron Warriors · Primarque',
      image: 'assets/img/personnages/perturabo.jpg',
      lore: "Perturabo est le Primarque de la IVe Légion, les Iron Warriors, génie froid de l'ingénierie et des sièges. Calculateur et méthodique, il conçoit la guerre comme un problème à résoudre par la logique, l'artillerie et la géométrie parfaite du massacre. Toute sa vie, il se sentit sous-estimé par l'Empereur et méprisé par ses frères, relégué aux campagnes les plus ingrates alors qu'il se pensait indispensable. Ce ressentiment rongea peu à peu son esprit, nourrissant amertume, jalousie et paranoïa, jusqu'à le pousser vers la trahison. Lors de l'Hérésie d'Horus, Perturabo mit ses Iron Warriors au service du Maître de Guerre, brisant les forteresses de l'Imperium avec une précision impitoyable. Devenu l'incarnation de la destruction assiégeante, il laissa derrière lui des mondes réduits à des carcasses de béton et d'acier, gravant à jamais son nom dans la légende la plus sombre de l'Adeptus Astartes.",
    },
    {
      nom: 'Conrad Kurze',
      titre: 'Primarque des Night Lords',
      faction: 'Night Lords · Primarque',
      image: 'assets/img/personnages/konrad-curze.jpg',
      lore: "Konrad Curze, le Night Haunter, est le primarque tourmenté de la VIIIe Légion durant l'Hérésie d'Horus. Élevé dans les bas-fonds de Nostramo, il instaura un ordre brutal par la terreur et la violence extrême. Affligé de visions prophétiques constantes annonçant sa mort et la corruption galactique, il sombra progressivement dans la folie. Durant l'Hérésie, Curze rejoignit Horus par nihilisme et désillusion totale envers l'Empereur, dont il dénonçait l'hypocrisie. Il transforma ses Night Lords en bourreaux sadiques massacrant des populations entières pour prouver que seule la peur gouverne l'humanité. Contrairement aux autres traîtres assoiffés de pouvoir, Curze cherchait à démontrer que justice et moralité étaient des illusions. Il accepta finalement sa mort prophétisée aux mains d'un assassin impérial, refusant toute rédemption et assumant pleinement sa nature monstrueuse.",
    },
    {
      nom: 'Sanguinius',
      titre: 'Primarque des Blood Angels',
      faction: 'Blood Angels',
      image: 'assets/img/personnages/sanguinius.jpg',
      lore: "Sanguinius est le sublime Primarque de la IXe Légion, les Blood Angels, un être à l'allure d'ange dont la grâce masque une puissance guerrière terrifiante. Né sur Baal Secundus, il fut vénéré comme un sauveur par des survivants qui acceptèrent ses ailes plutôt que de le craindre. Lorsque l'Empereur le retrouva, il lui confia la IXe Légion qui prit le nom de Blood Angels et devint un symbole d'espoir pour l'Imperium. Chef charismatique, stratège brillant et parangon de noblesse, Sanguinius portait pourtant une tare génétique : la Soif Rouge, pulsion sanguinaire qu'il tenta de contenir pour préserver l'honneur de ses fils. Durant l'Hérésie d'Horus, il combattit sans relâche jusqu'au Siège de Terra, où il affronta Horus lui-même et mourut en martyr. Sa mort et son sacrifice hantent encore tous les descendants des Blood Angels.",
    },
  ];

  const PLACEHOLDER_SVG =
    '<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="52" height="52" rx="2"/><path d="M4 40 l14-14 10 10 12-16 16 20"/><circle cx="42" cy="18" r="5"/></svg>';

  function buildSlide(perso, index, total) {
    const imgHTML = [
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
      '</div>',
    ].join('');

    const bodyHTML = [
      '<div class="perso-carousel__body">',
      '<span class="perso-carousel__faction">' +
        escapeHTML(perso.faction) +
        '</span>',
      '<h3 class="perso-carousel__name">' + escapeHTML(perso.nom) + '</h3>',
      '<p class="perso-carousel__title">' + escapeHTML(perso.titre) + '</p>',
      '<div class="perso-carousel__ornament" aria-hidden="true"><span>&#9778; Dossier Inquisitorial &#9778;</span></div>',
      '<p class="perso-carousel__lore">' + escapeHTML(perso.lore) + '</p>',
      '</div>',
    ].join('');

    return [
      '<article',
      '  class="perso-carousel__slide"',
      '  role="group"',
      '  aria-roledescription="slide"',
      '  aria-label="' +
        escapeAttr(perso.nom) +
        ', ' +
        (index + 1) +
        ' sur ' +
        total +
        '"',
      '>',
      imgHTML,
      bodyHTML,
      '</article>',
    ].join('');
  }

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

  function injectCarousel(section) {
    const total = PERSONNAGES.length;

    const slidesHTML = PERSONNAGES.map(function (p, i) {
      return buildSlide(p, i, total);
    }).join('');

    const dotsHTML = PERSONNAGES.map(function (p, i) {
      return [
        '<button',
        '  class="perso-carousel__dot' + (i === 0 ? ' is-active' : '') + '"',
        '  role="tab"',
        '  aria-label="' + escapeAttr(p.nom) + '"',
        '  aria-selected="' + (i === 0 ? 'true' : 'false') + '"',
        '  data-perso-dot="' + i + '"',
        '></button>',
      ].join('');
    }).join('');

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

      '<p class="perso-carousel__counter" aria-live="polite" aria-atomic="true" id="perso-counter">1 / ' +
        total +
        '</p>',

      '</div>',
    ].join('');
  }

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
    let touchStartX = null;
    let touchStartY = null;
    const SWIPE_THRESH = 50;
    let mouseStartX = null;
    let isDragging = false;

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

    function goTo(index, announce) {
      index = ((index % total) + total) % total;
      if (index === current && announce === false) return;

      current = index;

      track.style.transform = 'translateX(-' + current * 100 + '%)';

      dots.forEach(function (dot, i) {
        const active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (counter) counter.textContent = current + 1 + ' / ' + total;

      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
      });
    }

    slides.forEach(function (slide, i) {
      if (i !== 0) slide.setAttribute('aria-hidden', 'true');
    });

    btnPrev.addEventListener('click', function () {
      goTo(current - 1);
    });
    btnNext.addEventListener('click', function () {
      goTo(current + 1);
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-perso-dot'), 10));
      });
    });

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

    if (!carousel.hasAttribute('tabindex'))
      carousel.setAttribute('tabindex', '0');

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

    track.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
    });
  }

  function init() {
    const target = document.getElementById('perso-carousel-container');
    if (!target) return;

    injectCarousel(target);
    initLogic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
