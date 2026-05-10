import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Fonctions exposées globalement par utils.js
        escapeHTML: 'readonly',
        escapeAttr: 'readonly',
        elementExists: 'readonly',
        // Fonctions privées exposées globalement par ui.js (utilisées par injectNav)
        _initTheme: 'writable',
        _initMobileMenu: 'writable',
      },
      ecmaVersion: 2020,
      sourceType: 'script',
    },
    rules: {
      // Sévérité stricter
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',

      // Qualité de code
      'no-implied-eval': 'error',
      'no-with': 'error',
      'no-eval': 'error',
      'no-new-func': 'error',
      'prefer-template': 'warn',

      // Convention de nommage et style
      'camelcase': [
        'warn',
        {
          properties: 'never',
          ignoreDestructuring: true,
        },
      ],
      'id-length': [
        'warn',
        {
          min: 2,
          exceptions: ['i', 'j', '_', 'e', 'x', 'y', 't', 'p', 'b', 'f', 's', 'r', 'd'],
        },
      ],
    },
  },
  // Exceptions pour le fichier de config ESLint (utilise import/export)
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
]);
