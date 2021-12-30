import PackageManagerScripts from '../services/PackageManagerScript.js'

/**
 * Factory to create PackageManager services.
 *
 * @param {object} configuration
 * @param {CommandExecuter} commandExecuter
 * @returns {PackageManagerScripts}
 */
export default function (configuration, commandExecuter) {
  const files = configuration.autodiscover

  return new PackageManagerScripts(commandExecuter, files)
}
