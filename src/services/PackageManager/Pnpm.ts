import Npm from './Npm.js'

/**
 * Pnpm goodies.
 */
export default class Pnpm extends Npm {
  protected override command = 'pnpm'
}
