import AbstractPackageManager from '#services/PackageManager/AbstractPackageManager'

/**
 * Helper for scripts commands coming from package managers.
 * Gather all scripts from the managers.
 */
export default class PackageManagerScript {
  constructor(private managers: Array<AbstractPackageManager>) {}

  /**
   * Returns true if any package manager can handle the given script.
   */
  hasScript(script: string): boolean {
    return this.managers.some((manager) => manager.hasScript(script))
  }

  /**
   * Return all the managers that can execute Script.
   */
  getManagersForScript(script: string): AbstractPackageManager[] {
    return this.managers.filter((manager) => manager.hasScript(script))
  }

  /**
   * Return map of the scripts from the package managers.
   */
  getScripts(): Map<AbstractPackageManager, Set<string>> {
    const scripts = new Map()

    this.managers.forEach((manager) => {
      const managerScripts = manager.getScripts()
      const managerName = manager.constructor.name
      scripts.set(managerName, new Set())
      managerScripts.forEach((scriptName) => {
        scripts.get(managerName).add(scriptName)
      })
    })

    return scripts
  }
}
