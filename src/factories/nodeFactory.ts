import type { Provider } from 'nconf'
import type AbstractPackageManager from '#services/PackageManager/AbstractPackageManager'
import Npm from '#services/PackageManager/Npm'
import Pnpm from '#services/PackageManager/Pnpm'
import Yarn from '#services/PackageManager/Yarn'
import type EnvironmentManager from '#src/services/EnvironmentManager'

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
