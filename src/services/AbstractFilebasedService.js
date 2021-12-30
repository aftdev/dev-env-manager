import fs from 'fs'

/**
 * AbstractFilebasedService.
 */
export default class AbstractFilebasedService {
  static FILE = '.unknown'
  static COMMAND = 'command'

  _commandExecuter

  constructor(commandExecuter) {
    this._commandExecuter = commandExecuter
  }

  /**
   * Wether or not the service is enabled based on existence of its configuration file.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return fs.existsSync(this.constructor.FILE)
  }

  /**
   * Execute a command for this service.
   *
   * @param {Array} args
   * @returns
   */
  execute(args) {
    return this._commandExecuter.execute(this.constructor.COMMAND, args)
  }
}
