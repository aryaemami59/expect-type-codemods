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
      'vitest/valid-title': [0],
    },
  },
  prettierConfig,
] satisfies ConfigArray

export default eslintConfig
