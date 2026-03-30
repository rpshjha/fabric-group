import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'playwright-report',
      'test-results',
      'coverage',
      '.husky',
      'package-lock.json',
      'test-output/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      playwright,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      complexity: ['warn', 8],
      'max-depth': ['warn', 3],
      'max-params': ['warn', 4],

      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off',

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-element-handle': 'warn',
      'playwright/no-eval': 'warn',
    },
  },

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
];
