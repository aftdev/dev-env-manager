import EnvironmentManager from '#services/EnvironmentManager.js'
import Composer from '#services/PackageManager/Composer.js'

/**
 * Factory to create Composer service.
 */
export default function (environmentManager: EnvironmentManager): Composer {
  return new Composer(environmentManager)
}
