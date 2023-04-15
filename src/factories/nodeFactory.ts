import type { Provider } from 'nconf'
import type AbstractPackageManager from '#services/PackageManager/AbstractPackageManager.js'
import Npm from '#services/PackageManager/Npm.js'
import Pnpm from '#services/PackageManager/Pnpm.js'
import Yarn from '#services/PackageManager/Yarn.js'
import type EnvironmentManager from '#src/services/EnvironmentManager.js'

/**.
 * Factory to create and return the node package manager
 */
export default function (
  configuration: Provider,
  environmentManager: EnvironmentManager,
): AbstractPackageManager {
  const managerMapping = {
    pnpm: Pnpm,
    yarn: Yarn,
    npm: Npm,
  }

  const nodeManager = configuration.get(
    'package_managers:node:manager',
  ) as keyof typeof managerMapping

  const Manager = managerMapping[nodeManager] || Npm
  return new Manager(environmentManager)
}
