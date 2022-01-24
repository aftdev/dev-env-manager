import Composer from '../services/PackageManager/Composer.js'

/**
 * Factory to create Composer service.
 *
 * @returns {Composer}
 */
export default function (commandExecuter) {
  return new Composer(commandExecuter)
}
