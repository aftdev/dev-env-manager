import AbstractPackageManager from '#services/PackageManager/AbstractPackageManager'

/**
 * Composer (Php Package Manager).
 */
export default class Composer extends AbstractPackageManager {
  protected override configArg = undefined
  protected override command = 'composer'
  protected override defaultConfigFile = 'composer.json'
}
