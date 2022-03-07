import Npm from '../services/PackageManager/Npm.js'
import Pnpm from '../services/PackageManager/Pnpm.js'
import Yarn from '../services/PackageManager/Yarn.js'

/**.
 * Factory to create and return the node package manager
 *
 * @param {nConfig} configuration
 * @param {EnvironmentManager} environmentManager
 * @returns {AbstractPackageManager}
 */
export default function (configuration, environmentManager) {
  const nodeManager = configuration.get('package_managers:node:manager')
  const managerMapping = {
    pnpm: Pnpm,
    yarn: Yarn,
    npm: Npm,
  }

  const Manager = managerMapping[nodeManager] || Npm
  return new Manager(environmentManager)
}
