import type { AwilixContainer } from 'awilix'
import type { Provider } from 'nconf'
import AbstractPackageManager from '#services/PackageManager/AbstractPackageManager.js'
import PackageManagerScripts from '#services/PackageManagerScript.js'

type Config = {
  auto_discover?: boolean
  priority?: number
}
export type PackageManagerConfig = Record<string, Config>

/**
 * Factory to create PackageManager service.
 */
export default function (
  container: AwilixContainer,
  configuration: Provider,
): PackageManagerScripts {
  // Fetch all the managers that are marked as autodiscoverable
  const packageManagerConfig = configuration.get('package_managers') as Record<
    string,
    PackageManagerConfig
  >
  const managers: (Required<Pick<Config, 'priority'>> & {
    manager: AbstractPackageManager
  })[] = []

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
