import fs from 'fs'
import AbstractFilebasedService from '../AbstractFilebasedService.js'

/**
 * AbstractFilebasedService.
 */
export default class AbstractPackageManager extends AbstractFilebasedService {
  static FILE = '.unknown'
  static COMMAND = 'command'

  #scripts = null

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
