import EnvironmentManager from '#services/EnvironmentManager'
import Composer from '#services/PackageManager/Composer'

/**
 * Factory to create Composer service.
 */
export default function (environmentManager: EnvironmentManager): Composer {
  return new Composer(environmentManager)
}
