import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['assets/js/**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        escapeHTML: 'readonly',
        escapeAttr: 'readonly',
        elementExists: 'readonly',
        _initTheme: 'writable',
        _initMobileMenu: 'writable',
      },
      ecmaVersion: 2020,
      sourceType: 'script',
    },
    rules: {
      'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-implied-eval': 'error',
      'no-with': 'error',
      'no-eval': 'error',
      'no-new-func': 'error',
      'prefer-template': 'warn',
      'camelcase': ['warn', { properties: 'never', ignoreDestructuring: true }],
      'id-length': ['warn', { min: 2, exceptions: ['i', 'j', '_', 'e', 'x', 'y', 't', 'p', 'b', 'f', 's', 'r', 'd'] }],
    },
  },
  {
    files: ['eslint.config.mjs'],
    languageOptions: { sourceType: 'module' },
  },
]);
