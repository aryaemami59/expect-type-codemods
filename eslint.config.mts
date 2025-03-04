import js from '@eslint/js'
import vitestPlugin from '@vitest/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'
import type { ConfigArray } from 'typescript-eslint'
import { configs } from 'typescript-eslint'

const eslintConfig = [
  {
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
  js.configs.recommended,
  ...configs.strictTypeChecked,
  ...configs.stylisticTypeChecked,
  vitestPlugin.configs.recommended,
  {
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
    },
  },
  prettierConfig,
] satisfies ConfigArray

export default eslintConfig
