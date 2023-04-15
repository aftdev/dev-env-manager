import AbstractPackageManager from './AbstractPackageManager.js'

/**
 * Npm goodies.
 */
export default class Npm extends AbstractPackageManager {
  protected override configArg = undefined
  protected override command = 'npm'
  protected override defaultConfigFile = 'package.json'

  override executeScript(script: string, args = []) {
    this.execute(['run', script, ...args])
  }
}
