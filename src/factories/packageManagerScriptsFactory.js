import AbstractPackageManager from '../services/PackageManager/AbstractPackageManager.js'
import PackageManagerScripts from '../services/PackageManagerScript.js'

/**
 * Factory to create PackageManager service.
 *
 * @param {AwilixContainer} container
 * @param {nconf.Provider} configuration
 * @returns {PackageManagerScripts}
 */
export default function (container, configuration) {
  // Fetch all the manager that are marked as autodiscoverable
  const packageManagerConfig = configuration.get('package_managers')
  const managers = []

  // Filter all managers that are enabled and configured to be "auto discovered"
  Object.entries(packageManagerConfig).forEach(([managerName, config]) => {
    if (!config?.auto_discover) {
      return
    }
    const priority = Number(config.priority || 1)

    const manager = container.resolve(managerName)
    if (manager instanceof AbstractPackageManager && manager.isEnabled()) {
      managers.push({ manager, priority })
    }
  })

  // Sort by priority.
  const orderedManagers = managers
    .sort((a, b) => b.priority - a.priority)
    .map((managerInfo) => managerInfo.manager)

  return new PackageManagerScripts(orderedManagers)
}
