import fs from 'fs'

/**
 * Mixins functions used by Service that require config files to function.
 */
export default {
  /**
   * Set the configuration files needed by the service.
   *
   * @param {Array} configFiles
   */
  setConfigFiles(configFiles = []) {
    // Decide what config file to use.
    if (typeof configFiles == 'string') {
      configFiles = [configFiles]
    }

    if (configFiles.length > 0) {
      this._configFiles = configFiles
    } else {
      this._configFiles = [this.constructor.CONFIG_FILE]
    }
  },

  /**
   * Return true if all configuration files are present.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return this._configFiles.every((file) => fs.existsSync(file))
  },

  /**
   *
   * @param {*} args
   * @returns {Array}
   */
  injectServiceConfig(args = []) {
    return [...this._getConfigArguments(), ...args].filter((n) => n)
  },

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
  },

  /**
   * Return array of arguments needed to use the defined config files.
   *
   * @returns {Array}
   */
  _buildConfigArguments() {
    return [{ [this.constructor.CONFIG_ARGUMENT]: this._configFiles }]
  },
}
