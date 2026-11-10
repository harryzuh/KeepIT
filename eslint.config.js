import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/node_modules/', '**/dist/', '**/coverage/', 'backend/src/generated/', 'docs/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },

  // API: Node
  {
    files: ['backend/**/*.ts'],
    languageOptions: { globals: globals.node },
  },

  // Um módulo da API só conversa com outro módulo pelo service dele.
  {
    files: ['backend/src/modules/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\./(?!\\.\\.)[^/]+/(?![^/]+\\.service$)',
              message:
                'Um módulo só importa outro módulo pelo arquivo <modulo>.service. Combine a mudança em uma issue antes.',
            },
          ],
        },
      ],
    },
  },

  // Front-end: navegador + React
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@prisma/*', '**/backend/**'],
              message: 'O front-end fala com a API só por HTTP (src/lib/api.ts).',
            },
          ],
        },
      ],
    },
  },

  prettier,
);
