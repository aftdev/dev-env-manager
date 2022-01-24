/**
 * Helper for scripts commands coming from package managers.
 * Gather all scripts from the managers.
 */
export default class PackageManagerScript {
  #managers

  /**
   * @param {Array<AbstractPackageManager>} managers
   */
  constructor(managers) {
    this.#managers = managers
  }

  /**
   * Returns true if any package manager can handle the given script.
   *
   * @param {string} script
   * @returns {boolean}
   */
  hasScript(script) {
    return this.#managers.some((manager) => manager.hasScript(script))
  }

  /**
   * Return all the managers that can execute Script.
   *
   * @param {string} script
   * @returns {Array}
   */
  getManagersForScript(script) {
    return this.#managers.filter((manager) => manager.hasScript(script))
  }

  /**
   * Return map of the scripts from the package managers.
   *
   * @returns {Map}
   */
  getScripts() {
    const scripts = new Map()

    this.#managers.forEach((manager) => {
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
