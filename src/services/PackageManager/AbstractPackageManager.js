import fs from 'fs'
import FilebasedServiceMixin from '../../mixins/FilebasedServiceMixin.js'

/**
 * AbstractPackageManager class.
 *
 * @abstract
 */
export default class AbstractPackageManager {
  static FILE = '.unknown'
  static COMMAND = 'command'

  #scripts = null
  #envManager

  /**
   * Create class and configure it properly.
   *
   * @param {*} environmentManager
   * @param {*} configFiles
   */
  constructor(environmentManager, configFiles) {
    this.#envManager = environmentManager
    this.setConfigFiles(configFiles)
  }

  /**
   * Execute a command for this service.
   *
   * @param {Array} args
   */
  execute(args) {
    args = [...this._getConfigArguments(), ...args]

    return this.#envManager.executeCommand(this.constructor.COMMAND, args)
  }

  /**
   * Install / download all packages.
   */
  install() {
    this.execute(['install'])
  }

  /**
   * Execute Script.
   *
   * @param {string} script
   * @param {Array} args
   *
   * @returns
   */
  executeScript(script, args = []) {
    args = [script, ...args]

    return this.execute(args)
  }

  /**
   * Return true if this manager can handle the script.
   *
   * @param {string} script
   * @returns {bool}
   */
  hasScript(script) {
    return this.getScripts().includes(script)
  }

  /**
   * Return all scripts that are available for this manager.
   *
   * Note: only works with json config file for now.
   *
   * @returns {Array}
   */
  getScripts() {
    if (null === this.#scripts) {
      this.#scripts = []
      this._configFiles.forEach((filePath) => {
        const jsonValue = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        for (const script in jsonValue?.scripts) {
          this.#scripts.push(script)
        }
      })
    }

    return this.#scripts
  }
}

Object.assign(AbstractPackageManager.prototype, FilebasedServiceMixin)
