import AbstractPackageManager from './AbstractPackageManager.js'

/**
 * Composer (Php Package Manager).
 */
export default class Composer extends AbstractPackageManager {
  static COMMAND = 'composer'
  static CONFIG_FILE = 'composer.json'
}
