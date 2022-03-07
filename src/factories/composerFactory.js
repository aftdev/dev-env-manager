import Composer from '../services/PackageManager/Composer.js'

/**
 * Factory to create Composer service.
 *
 * @returns {Composer}
 */
export default function (environmentManager) {
  return new Composer(environmentManager)
}
