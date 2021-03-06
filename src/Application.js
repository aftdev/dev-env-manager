import fs from 'fs'
import path from 'path'
import process from 'process'
import { RESOLVER, Lifetime, asFunction } from 'awilix'

export default class Application {
  static CONFIG_FILE = 'dev-env-config.yml'
  static CONFIG_FILE_OVERRIDE = 'dev-env-config.override.yml'

  #container
  #rootPath
  #projectPath
  #bootstrapped = false

  /**
   * @param {AwilixContainer} container
   * @param {string} rootPath
   */
  constructor(container, rootPath, projectPath) {
    this.#container = container
    this.#rootPath = rootPath
    this.#projectPath = projectPath
  }

  /**
   * Bootstrap the application.
   */
  async bootstrap() {
    // Change current working directory and register path in container.
    process.chdir(this.#projectPath)

    try {
      // Load each commands
      const commands = await this.#fetchProjectCommands()

      // Use container to load all command modules.
      commands.forEach((module) => {
        this.#container.build(asFunction(module))
      })

      this.#bootstrapped = true
    } catch (err) {
      const outputFormatter = this.#container.resolve('outputFormatter')

      outputFormatter.error('Not all command files could be bootstrapped')
      throw err
    }
  }

  /**
   * Execute application command.
   *
   * @param {Array} args
   *
   * @returns {Promise}
   */
  async run(args = []) {
    try {
      if (!this.#bootstrapped) {
        throw 'Application not bootstrapped'
      }

      const cli = this.#container.resolve('cli')

      // No command were entered, display help.
      if (args.length == 0) {
        cli.outputHelp()
        return 0
      }

      // Execute command.
      // Always use ASYNC as some sub commands could be async.
      // This allow us to wait for any commands to be over and catch any errors.
      await cli.parseAsync(args, { from: 'user' })
      return 0
    } catch (e) {
      this.#container.resolve('outputFormatter').renderError(e)
      return 1
    }
  }

  /**
   * Fetch all the commands for current project.
   *
   * @returns {Array<Function>}
   */
  async #fetchProjectCommands() {
    const commandsFiles = []

    // From our folder.
    const commandDir = `${this.#rootPath}/commands`
    const defaultCommands = fs
      .readdirSync(commandDir)
      .map((file) => `${commandDir}/${file}`)

    // From project folders.
    const configuration = this.#container.resolve('configuration')
    const projectCommandsDirs = configuration.get('commands_dirs')

    const projectCommands =
      this.#getCommandsFromProjectDirs(projectCommandsDirs)

    const commands = [...projectCommands, ...defaultCommands].filter(
      (el) => ['.js', '.mjs', '.cjs', '.ts'].indexOf(path.extname(el)) !== -1,
    )

    for (const file of commands) {
      const { default: module } = await import(file)
      if (module) {
        commandsFiles.push(module)
      }
    }

    return commandsFiles
  }

  /**
   * Create iterator of commands files.
   *
   * @param {Array | object | string} dirs
   */
  *#getCommandsFromProjectDirs(dirs) {
    // Cast string to array if needed.
    if (typeof dirs === 'string') {
      dirs = [dirs]
    }

    for (let item in dirs) {
      const projectCommandDir = dirs[item]
      if (projectCommandDir && fs.existsSync(projectCommandDir)) {
        yield* fs
          .readdirSync(projectCommandDir)
          .map((file) => path.resolve(projectCommandDir, file))
      }
    }
  }
}

// DI info
Application[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
