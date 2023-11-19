/**
 * Mocha configuration
 *
 * @see https://mochajs.org/#configuring-mocha-nodejs
 */
module.exports = {
  require: ['tests/hooks.mjs'],
  extension: ['js', 'ts'],
  import: 'tsx',
}
