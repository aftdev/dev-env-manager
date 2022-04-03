/**
 * Commit lint configuration.
 *
 * @see https://commitlint.js.org/#/reference-configuration
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Override rules
  rules: {
    // Allow body lines to be more than 100 characters as dependabot messages
    // are quite verbose
    'body-max-line-length': [2, 'always', '255'],
  },
}
