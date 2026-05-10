/**
 * Module de gestion de la campagne narrative côté front.
 * - Alimente les pages à partir de `assets/data/campagne.json`.
 * - Gère le rendu du lore, des fronts de bataille et certains effets visuels (.reveal).
 * - Sert de couche intermédiaire entre les données brutes et le DOM.
 */
(function () {
  'use strict';

  /**
   * Initialise le système d'onglets pour les fronts de bataille.
   * - Cible tous les éléments .front-tab et .front-panel déjà présents dans le DOM.
   * - Met à jour les classes CSS et les attributs ARIA pour refléter l’onglet actif.
   * - Ne crée aucun élément : se contente de brancher le comportement d’interface.
   */
  function initTabs() {
    const tabs = document.querySelectorAll('.front-tab');
    const panels = document.querySelectorAll('.front-panel');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Réinitialise l’état de tous les onglets
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        // Masque tous les panneaux
        panels.forEach((p) => p.classList.remove('active'));

        // Active l’onglet cliqué
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Affiche le panneau correspondant à data-tab (id construit côté rendu)
        const p = document.getElementById('tab-' + tab.dataset.tab);
        if (p) p.classList.add('active');
      });
    });
  }

  // ── RENDER LORE ────────────────────────────────────────────────────────────

  /**
   * Remplit les sections #lore-desc et #lore-grid avec les données narratives.
   * - Utilise textContent pour le résumé global (#lore-desc) afin d’éviter les injections.
   * - Construit ensuite un HTML contrôlé pour chaque bloc de lore dans #lore-grid.
   * - Chaque bloc reçoit des classes .reveal / .reveal-delay-X pour les animations d’apparition.
   * @param {Object} lore - Données du lore ({ description, blocs: [{titre, paragraphes, citation}] }).
   */
  function renderLore(lore) {
    // Résumé général du lore de campagne
    document.getElementById('lore-desc').textContent = lore.description;

    // Grille des blocs narratifs détaillés
    document.getElementById('lore-grid').innerHTML = lore.blocs
      .map(
        (b, i) =>
          `<div class="lore-text reveal${i > 0 ? ' reveal-delay-2' : ''}">
        <h3>${escapeHTML(b.titre)}</h3>
        ${b.paragraphes.map((p) => `<p>${escapeHTML(p)}</p>`).join('')}
        <div class="quote-block${b.citation.alerte ? ' quote-block--alert' : ''}">
          <p class="quote-text">${escapeHTML(b.citation.texte)}</p>
          <span class="quote-author">${escapeHTML(b.citation.auteur)}</span>
        </div>
      </div>`,
      )
      .join('');
  }

  // ── RENDER FRONTS ──────────────────────────────────────────────────────────

  /**
   * Peuple les onglets #fronts-tabs et les panneaux #fronts-panels avec les données de fronts.
   * - Génère d’abord la liste d’onglets (boutons .front-tab) à partir des ids de front.
   * - Crée ensuite un panneau par front avec titre, description, statut, image et journal de bataille.
   * - Gère aussi l’affichage d’un tableau de stations (ex. agro-stations) si la donnée est présente.
   * @param {Array<Object>} fronts - Tableau des fronts ({ id, nom, titre, description,
   *   statut, statut_classe, batailles, stations, image, image_alt }).
   */
  function renderFronts(fronts) {
    // Barre d’onglets des fronts
    document.getElementById('fronts-tabs').innerHTML = fronts
      .map(
        (f, i) =>
          `<button class="front-tab${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" data-tab="${f.id}">${f.nom}</button>`,
      )
      .join('');

    // Panneaux de contenu des fronts
    document.getElementById('fronts-panels').innerHTML = fronts
      .map((f, i) => {
        // Bloc stations (ex. agro-stations), optionnel
        const stationsHTML = f.stations
          ? `
        <h4>Statut des ${f.stations.length} Agro-Stations</h4>
        <div class="stations-grid">${f.stations
          .map(
            (s) =>
              `<div class="station-card"><div class="station-num">${s.num}</div><div class="station-label">Station</div><span class="station-owner ${s.classe}">${s.proprietaire}</span></div>`,
          )
          .join('')}</div>`
          : '';

        // Bloc image (bannière ou visuel de front), optionnel
        const imageHTML = f.image
          ? f.stations
            ? `<img src="${f.image}" alt="${f.image_alt}" width="1200" height="400" loading="lazy">`
            : `<div class="front-visual"><img src="${f.image}" alt="${f.image_alt}" width="1600" height="900" loading="lazy"></div>`
          : '';

        // Journal des batailles pour ce front
        const bataillesHTML = f.batailles
          .map((b) => {
            const classeAttr = b.classe ? ` ${b.classe}` : '';
            const titreHTML = b.titre
              ? `<h4 class="battle-title">${escapeHTML(b.titre)}</h4>`
              : '';
            return `<div class="battle-entry${classeAttr}">
          <p class="battle-label">${escapeHTML(b.label || '')}</p>
          ${titreHTML}
          <p class="battle-text">${escapeHTML(b.texte)}</p>
          <div class="battle-factions">${b.factions
            .map(
              (fc) =>
                `<span class="faction-tag ${fc.classe}">${fc.label}</span>`,
            )
            .join('')}</div>
        </div>`;
          })
          .join('');

        // Panneau complet pour un front
        return `<div class="front-panel${i === 0 ? ' active' : ''}" id="tab-${f.id}" role="tabpanel">
        <div class="front-header">
          <div><h3 class="front-title">${escapeHTML(f.titre)}</h3><p class="front-desc">${escapeHTML(
            f.description,
          )}</p></div>
          <span class="front-status ${escapeHTML(f.statut_classe)}">${escapeHTML(f.statut)}</span>
        </div>
        ${imageHTML}${stationsHTML}
        ${
          f.stations
            ? '<div class="ornament section-ornament"><span>Chronique des Batailles</span></div>'
            : ''
        }
        <div class="battle-log">${bataillesHTML}</div>
      </div>`;
      })
      .join('');
  }

  // ── FETCH & RENDER ────────────────────────────────────────────────────────
  // Point d’entrée général pour les données de campagne :
  // - Vérifie la présence des éléments cibles (#lore-desc, #fronts-tabs) avant de lancer un fetch.
  // - Évite de déclencher une erreur sur les pages qui ne consomment pas ces données.
  // - Branche ensuite le rendu et les effets .reveal si nécessaire.

  const hasLore = document.getElementById('lore-desc') !== null;
  const hasFronts = document.getElementById('fronts-tabs') !== null;

  if (hasLore || hasFronts) {
    fetch('assets/data/campagne.json')
      .then((r) => {
        if (!r.ok) {
          // Gestion d’erreur réseau / HTTP avec message explicite en console
          throw new Error('Erreur HTTP ' + r.status + ' : ' + r.statusText);
        }
        return r.json();
      })
      .then((d) => {
        // Rendu conditionnel selon la page
        if (hasLore) renderLore(d.lore);
        if (hasFronts) renderFronts(d.fronts);

        // Initialisation des onglets après insertion des fronts
        initTabs();

        // Événement custom pour prévenir d’autres scripts que les données sont prêtes
        document.dispatchEvent(
          new CustomEvent('campagne:ready', {
            detail: { personnages: d.personnages || [] },
          }),
        );
      })
      .catch((err) => {
        // Erreur globale de chargement de la campagne
        console.error('Erreur chargement campagne.json :', err);
        // Bannière de fallback très visible en haut de page
        document.body.insertAdjacentHTML(
          'afterbegin',
          '<div style="background:#8b1c1c;color:#fff;padding:1rem;text-align:center">Erreur : impossible de charger campagne.json</div>',
        );
      })
      .finally(() => {
        // Mise en place des animations .reveal pour cette page (si supporté)
        if ('IntersectionObserver' in window) {
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
          document
            .querySelectorAll('.reveal:not(.visible)')
            .forEach((el) => obs.observe(el));
        }
      });
  } else {
    // Cas des pages qui ne consomment pas campagne.json :
    // on initialise quand même IntersectionObserver pour les animations .reveal.
    if ('IntersectionObserver' in window) {
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
      document
        .querySelectorAll('.reveal:not(.visible)')
        .forEach((el) => obs.observe(el));
    }
  }

  // ── CARROUSEL PRINCIPAL (HOME) ────────────────────────────────────────────
  // Gestion du carrousel d’images de la page d’accueil :
  // - Auto-play (sauf si prefers-reduced-motion).
  // - Pause au survol ou lors du focus clavier.
  // - Navigation via boutons précédent/suivant et flèches clavier.

  (function () {
    const carousel = document.getElementById('main-carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
    const dotsWrap = carousel.querySelector('.carousel__dots');
    const btnPrev = carousel.querySelector('.carousel__btn--prev');
    const btnNext = carousel.querySelector('.carousel__btn--next');
    if (!slides.length || !dotsWrap || !btnPrev || !btnNext) return;

    const INTERVAL = 3500;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let current = 0;
    let timer = null;

    // Création des indicateurs (dots) avec ARIA
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Image ${i + 1} sur ${slides.length}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) dot.classList.add('is-active');

      dot.addEventListener('click', () => {
        goTo(i);
        if (!reducedMotion) {
          stop();
          start();
        }
      });

      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      // Désactive l’ancienne slide
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');

      // Calcule l’index suivant (bouclage circulaire)
      current = ((index % slides.length) + slides.length) % slides.length;

      // Active la nouvelle slide
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    function start() {
      if (reducedMotion) return;
      stop();
      timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    function stop() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Gestion des interactions utilisateur
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    btnPrev.addEventListener('click', () => {
      goTo(current - 1);
      if (!reducedMotion) {
        stop();
        start();
      }
    });

    btnNext.addEventListener('click', () => {
      goTo(current + 1);
      if (!reducedMotion) {
        stop();
        start();
      }
    });

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Lance l’auto-play initial
    start();
  })();
})();
