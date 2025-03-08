import js from '@eslint/js'
import vitestPlugin from '@vitest/eslint-plugin'
import prettierConfig from 'eslint-config-prettier/flat'
import type { ConfigArray } from 'typescript-eslint'
import { configs } from 'typescript-eslint'

const eslintConfig = [
  {
    name: 'overrides/global-ignores',
    ignores: [
      '**/dist/',
      '**/.yalc/',
      '**/build/',
      '**/lib/',
      '**/temp/',
      '**/.temp/',
      '**/.yarn/',
      '**/coverage/',
      '**/__testfixtures__/',
    ],
  },
  { name: `${js.meta.name}/recommended`, ...js.configs.recommended },
  ...configs.strictTypeChecked,
  ...configs.stylisticTypeChecked,
  { name: 'vitest/recommended', ...vitestPlugin.configs.recommended },
  {
    name: 'overrides/overrides',
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        2,
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: true,
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        2,
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'vitest/valid-title': [0],
      'vitest/no-alias-methods': [2],
      'vitest/no-disabled-tests': [2],
      'vitest/no-focused-tests': [2],
      'vitest/no-test-prefixes': [2],
      'vitest/no-test-return-statement': [2],
      'vitest/prefer-each': [2],
      'vitest/prefer-spy-on': [2],
      'vitest/prefer-to-be': [2],
      'vitest/prefer-to-contain': [2],
      'vitest/prefer-to-have-length': [2],
    },

    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },

  prettierConfig,
] satisfies ConfigArray

export default eslintConfig
