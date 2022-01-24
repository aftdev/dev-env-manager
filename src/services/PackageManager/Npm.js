import AbstractPackageManager from './AbstractPackageManager.js'

/**
 * Npm goodies.
 */
export default class Npm extends AbstractPackageManager {
  static COMMAND = 'npm'
  static CONFIG_FILE = 'package.json'

  executeScript(script, args = []) {
    this.execute(['run', script, ...args])
  }
}
