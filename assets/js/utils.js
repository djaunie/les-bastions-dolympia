/**
 * utils.js — Fonctions utilitaires partagées
 * Les Bastions d'Olympia — Campagne Horus Heresy
 *
 * Contient les fonctions d'échappement HTML et autres utilitaires
 * réutilisés dans le projet (zéro dépendances externes).
 *
 * Usage : incluez ce fichier en premier avec <script src="assets/js/utils.js"></script>
 * Les fonctions sont ensuite disponibles globalement : escapeHTML(), escapeAttr(), etc.
 */
(function () {
  'use strict';

  /**
   * Échappe les caractères spéciaux HTML pour éviter les injections XSS.
   * @param {string|*} str - La chaîne à échapper (peut être null, nombre, etc.)
   * @returns {string} La chaîne échappée et sécurisée
   * @example
   *   escapeHTML('<script>alert("xss")</script>')
   *   // → '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
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
   * Échappe les caractères spéciaux pour une utilisation sûre en attributs HTML.
   * @param {string|*} str - La chaîne à échapper
   * @returns {string} La chaîne échappée pour les attributs
   * @example
   *   escapeAttr('Konrad Curze')  // → 'Konrad Curze'
   *   escapeAttr('It\'s "magic"') // → 'It&#39;s &quot;magic&quot;'
   */
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /**
   * Vérifie si un élément DOM existe.
   * @param {string} id - L'ID de l'élément
   * @returns {boolean} true si l'élément existe, false sinon
   */
  function elementExists(id) {
    return document.getElementById(id) !== null;
  }

  // Exposer les fonctions globalement
  window.escapeHTML = escapeHTML;
  window.escapeAttr = escapeAttr;
  window.elementExists = elementExists;
})();
