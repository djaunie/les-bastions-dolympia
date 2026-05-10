/**
 * utils.js — Fonctions utilitaires partagées
 * Les Bastions d'Olympia — Campagne Horus Heresy
 *
 * Contient principalement :
 * - des fonctions d’échappement HTML pour sécuriser les insertions dans le DOM ;
 * - un helper de vérification d’existence d’élément dans le document ;
 * - aucune dépendance externe : ce fichier est volontairement simple et léger.
 *
 * Usage :
 *   Incluez ce fichier en premier dans vos pages :
 *     <script src="assets/js/utils.js"></script>
 *   Les fonctions suivantes sont alors disponibles globalement :
 *     - escapeHTML()
 *     - escapeAttr()
 *     - elementExists()
 */
(function () {
  'use strict';

  /**
   * Échappe les caractères spéciaux HTML pour éviter les injections XSS.
   * - Convertit &, <, >, " et ' en entités HTML.
   * - Permet d’insérer le résultat dans innerHTML dans un contexte contrôlé.
   *
   * @param {string|*} str - La valeur à échapper (peut être null, nombre, etc.).
   * @returns {string} La chaîne échappée et sécurisée, prête à être utilisée dans innerHTML.
   *
   * @example
   *   // Usage dans une construction de HTML contrôlé
   *   const safe = escapeHTML('<script>alert("xss")</script>');
   *   // safe → '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
   */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Échappe les caractères spéciaux pour une utilisation sûre dans les attributs HTML.
   * - Concerne principalement les guillemets simples et doubles.
   * - À utiliser lorsque l’on injecte des valeurs dans des attributs (href, title, data-*, aria-*, …).
   *
   * @param {string|*} str - La chaîne à échapper.
   * @returns {string} La chaîne échappée pour les attributs (href, data-*, aria-*, etc.).
   *
   * @example
   *   // Usage pour des valeurs interpolées dans des attributs HTML
   *   const safeAttr = escapeAttr('It\'s "magic"');
   *   // safeAttr → 'It&#39;s &quot;magic&quot;'
   */
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /**
   * Vérifie si un élément DOM existe.
   * - Utilitaire léger pour éviter les accès null lors du branchement des comportements.
   * - Permet de rendre le code d’initialisation plus défensif et plus lisible.
   *
   * @param {string} id - L’ID de l’élément recherché dans le document.
   * @returns {boolean} true si l’élément existe, false sinon.
   *
   * @example
   *   if (elementExists('main-carousel')) {
   *     // on peut initialiser le carrousel en toute sécurité
   *   }
   */
  function elementExists(id) {
    return document.getElementById(id) !== null;
  }

  // Exposer les fonctions globalement pour qu’elles puissent être utilisées
  // dans les autres scripts (ui.js, campagne.js, personnages-carousel.js, etc.).
  window.escapeHTML = escapeHTML;
  window.escapeAttr = escapeAttr;
  window.elementExists = elementExists;
})();
