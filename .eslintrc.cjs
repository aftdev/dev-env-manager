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
]

const rules = {
  'no-process-exit': 'error',
  'arrow-body-style': 'error',
  curly: ['error', 'all'],
  'no-console': 'error',
  'no-only-tests/no-only-tests': 'error',
  'prefer-arrow-callback': 'error',
  'jsdoc/check-alignment': 'error',
  'jsdoc/check-param-names': 'error',
  'jsdoc/check-syntax': 'error',
  'jsdoc/check-tag-names': 'error',
  'jsdoc/check-types': 'error',
  'jsdoc/implements-on-classes': 'error',
  'jsdoc/newline-after-description': 'error',
  'jsdoc/require-description-complete-sentence': 'error',
  'jsdoc/require-hyphen-before-param-description': 'error',
  'jsdoc/require-returns-check': 'error',
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
  // Until eslint can figure out paths from package.json "imports" section
  'import/no-unresolved': [2, { ignore: ['^#.+$'] }],
}

const plugins = ['jsdoc', 'no-only-tests']

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
}
