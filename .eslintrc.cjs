/**
 * EsLint configuration file.
 *
 * @see https://eslint.org/docs/user-guide/configuring/
 */
const configs = [
  'eslint:recommended',
  'plugin:import/recommended',
  'plugin:promise/recommended',
  'plugin:prettier/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'prettier',
]

const rules = {
  'import/named': 'off',
  'no-process-exit': 'error',
  'arrow-body-style': 'error',
  curly: ['error', 'all'],
  'no-throw-literal': 'error',
  'no-console': 'error',
  'no-only-tests/no-only-tests': 'error',
  'prefer-arrow-callback': 'error',
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
  'promise/prefer-await-to-then': 'warn',
  'import/no-named-as-default-member': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-non-null-assertion': 'off',
}

const plugins = ['no-only-tests', '@typescript-eslint', 'eslint-plugin-tsdoc']

module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
  extends: configs,
  globals: { globalThis: 'readonly' },
  plugins,
  reportUnusedDisableDirectives: true,
  rules,
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
}
