import Npm from '#services/PackageManager/Npm'

/**
 * Yarn Service.
 */
export default class Yarn extends Npm {
  protected override command = 'yarn'
}
