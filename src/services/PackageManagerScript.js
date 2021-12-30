import fs from 'fs'

/**
 * Helper for scripts commands coming from package managers.
 */
export default class PackageManagerScript {
  #commandExecuter
  #scripts

  /**
   *
   * @param {CommandExecuter} commandExecuter
   * @param {Array} files
   */
  constructor(commandExecuter, files) {
    this.#commandExecuter = commandExecuter
    this.#initScriptFromFiles(files)
  }

  hasScript(script) {
    return script in this.#scripts
  }

  executeScript(script, args = []) {
    const command = this.#scripts[script]
    args.unshift(script)

    this.#commandExecuter.execute(command, args)
  }

  getScripts() {
    return Object.keys(this.#scripts)
  }

  /**
   * Set scripts from list of paths.
   *
   * @param {Array} files
   */
  #initScriptFromFiles(files) {
    this.#scripts = {}

    for (const filePath in files) {
      if (!fs.existsSync(filePath)) {
        continue
      }

      // Check if they have a script json property.
      const jsonValue = JSON.parse(fs.readFileSync(filePath, 'utf8'))

      for (const script in jsonValue?.scripts) {
        this.#scripts[script] = files[filePath]
      }
    }
  }
}
