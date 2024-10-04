// @ts-check

import eslint from '@eslint/js'
// @ts-expect-error: Looks like this plugin does not provide types
import importPlugin from 'eslint-plugin-import'
import mochaPlugin from 'eslint-plugin-mocha'
import nodePlugin from 'eslint-plugin-n'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginPromise from 'eslint-plugin-promise'
import tsDocEslint from 'eslint-plugin-tsdoc'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ...eslintPluginPrettierRecommended,
    ...{ name: 'prettier/recommended' },
  },
  nodePlugin.configs['flat/recommended-script'],
  importPlugin.flatConfigs.recommended,
  pluginPromise.configs['flat/recommended'],
  mochaPlugin.configs.flat.recommended,
  {
    name: 'tsdoc/recommended',
    plugins: {
      tsdoc: tsDocEslint,
    },
    rules: {
      'tsdoc/syntax': 'error',
    },
  },
  {
    name: 'application/ignores',
    ignores: ['.yarn/', 'dist/', 'docs/', 'coverage/', 'bin/'],
  },
  {
    name: 'application/settings',
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    name: 'application/rules/overrides',
    rules: {
      'arrow-body-style': 'error',
      curly: ['error', 'all'],
      'no-throw-literal': 'error',
      'no-console': 'error',
      'prefer-arrow-callback': 'error',
      'promise/prefer-await-to-then': 'warn',
      'import/named': 'off',
      'import/no-extraneous-dependencies': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          'newlines-between': 'never',
        },
      ],
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      'mocha/no-identical-title': 'off',
      'mocha/no-setup-in-describe': 'off',
      'n/no-missing-import': 'off', // Disabled because we are using typescript
    },
  },
  {
    name: 'application/tests/rules/overrides',
    files: ['tests/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
)
