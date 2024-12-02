import Npm from '#services/PackageManager/Npm'

/**
 * Pnpm goodies.
 */
export default class Pnpm extends Npm {
  protected override command = 'pnpm'
}
