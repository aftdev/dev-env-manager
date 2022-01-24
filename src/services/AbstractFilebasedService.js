import fs from 'fs'

/**
 * AbstractFilebasedService.
 */
export default class AbstractFilebasedService {
  static CONFIG_FILE = '.unknown'
  static COMMAND = 'command'
  static CONFIG_ARGUMENT = '-c'

  _commandExecuter
  _configFiles

  /**
   *
   * @param {CommandExecuter} commandExecuter
   * @param {Array | string} overrideConfigFiles - Paths to the config the manager should use.
   */
  constructor(commandExecuter, overrideConfigFiles = []) {
    this._commandExecuter = commandExecuter

    // Decide what config file to use.
    if (typeof overrideConfigFiles == 'string') {
      overrideConfigFiles = [overrideConfigFiles]
    }

    if (overrideConfigFiles.length > 0) {
      this._configFiles = overrideConfigFiles
    } else {
      this._configFiles = [this.constructor.CONFIG_FILE]
    }
  }

  /**
   * Wether or not the service is enabled based on existence of its configuration file.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return this._configFiles.every((file) => fs.existsSync(file))
  }

  /**
   * Execute a command for this service.
   *
   * @param {Array} args
   */
  execute(args) {
    args = [...this._getConfigArguments(), ...args]

    return this._commandExecuter.execute(this.constructor.COMMAND, args)
  }

  /**
   * Return array of arguments needed to use the defined config files.
   *
   * @returns {Array}
   */
  _getConfigArguments() {
    // Do we need to use an arg to target the config file ?
    if (
      this._configFiles.length == 1 &&
      this._configFiles[0] == this.constructor.CONFIG_FILE
    ) {
      return []
    }
    return this._buildConfigArguments()
  }

  /**
   * Return array of arguments needed to use the defined config files.
   *
   * @returns {Array}
   */
  _buildConfigArguments() {
    return [{ [this.constructor.CONFIG_ARGUMENT]: this._configFiles }]
  }
}
