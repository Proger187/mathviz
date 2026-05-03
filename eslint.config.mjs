// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  // Base JS recommended
  js.configs.recommended,

  // TypeScript strict rules for all TS/TSX files
  ...tseslint.configs.strict,

  // Import plugin for all TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: true,
      },
    },
    rules: {
      // ── Import ordering ──────────────────────────────────────────────────────
      // 5-group order: node built-ins → external → @mathviz/* → @/ absolute → relative
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // 1. node:fs, node:path
            'external', // 2. react, express, framer-motion
            'internal', // 3. @mathviz/* and @/
            'parent', // ../foo
            'sibling', // ./foo
            'index', // ./
          ],
          pathGroups: [
            {
              pattern: '@mathviz/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ── Internal module boundary ──────────────────────────────────────────
      // Prevents importing directly into another feature's subdirectory
      'import/no-internal-modules': [
        'error',
        {
          // Allow imports from within the same feature, lib, components/ui etc.
          allow: [
            // packages
            '@mathviz/shared',
            // Next.js internals
            'next/**',
            // drizzle-orm subpath imports
            'drizzle-orm/**',
            // Absolutely fine to import deep from node_modules
            '*/node_modules/**',
          ],
        },
      ],

      // ── TypeScript enums ban ──────────────────────────────────────────────
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message:
            'TypeScript enums are banned. Use `as const` objects with inferred union types instead.',
        },
      ],

      // ── Type safety ──────────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off', // handled by strict mode + explicit return type on exports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Ignore build outputs and generated files
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.config.mjs',
      // The ESLint config itself
      'eslint.config.mjs',
    ],
  },
)
