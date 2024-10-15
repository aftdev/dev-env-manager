import fs from 'fs'
import { resolve } from 'path'
import process from 'process'
import {
  RESOLVER,
  Lifetime,
  asFunction,
  AwilixContainer,
  FunctionReturning,
} from 'awilix'
import fg from 'fast-glob'

export default class Application {
  static [RESOLVER] = {
    lifetime: Lifetime.SCOPED,
  }

  static CONFIG_FILE = 'dev-env-config.yml'
  static CONFIG_FILE_OVERRIDE = 'dev-env-config.override.yml'
  static EXT_GLOB = '!(*.d).{js,ts,mjs,cjs}'

  private bootstrapped = false

  constructor(
    private container: AwilixContainer,
    private rootPath: string,
    private projectPath: string,
  ) {}

  /**
   * Bootstrap the application.
   */
  public async bootstrap(): Promise<boolean> {
    // Change current working directory and register path in container.
    process.chdir(this.projectPath)
    try {
      // Load each commands
      const commands = await this.fetchProjectCommands()

      // Use container to load all command modules.
      commands.forEach((module: FunctionReturning<unknown>) => {
        // For typescript and type-hinting, we use the proxy mode.
        this.container.build(asFunction(module).proxy())
      })

      this.bootstrapped = true
    } catch (err) {
      const output = this.container.resolve('outputFormatter')
      output.warning('Not all command files could be bootstrapped')
      output.error(err)
    }
    return this.bootstrapped
  }

  /**
   * Execute application command.
   */
  public async run(args: Array<string> = []): Promise<number> {
    try {
      if (!this.bootstrapped) {
        throw new Error('Application not bootstrapped')
      }

      const cli = this.container.resolve('cli')

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
    } catch (error) {
      const output = this.container.resolve('outputFormatter')
      output.error(error)
      return 1
    }
  }

  /**
   * Fetch all the commands for current project.
   */
  private async fetchProjectCommands(): Promise<FunctionReturning<unknown>[]> {
    const commandsFiles = []

    // From our folder.
    const defaultCommands = fg.sync(
      `${this.rootPath}/commands/**/${Application.EXT_GLOB}`,
    )

    // From project folders.
    const configuration = this.container.resolve('configuration')
    const projectCommandsDirs = configuration.get('commands_dirs')
    const projectCommands = this.getCommandsFromProjectDirs(projectCommandsDirs)

    const commands = [...projectCommands, ...defaultCommands].map((d) =>
      resolve(d),
    )

    for (const file of commands) {
      const { default: module } = await import(file)
      if (module) {
        commandsFiles.push(module)
      }
    }

    return commandsFiles
  }

  private getCommandsFromProjectDirs(
    dirs: Record<string, string> | Array<string> | string,
  ): Array<string> {
    if (typeof dirs === 'string') {
      dirs = [dirs]
    }
    if (typeof dirs === 'object') {
      dirs = Object.values(dirs)
    }

    const allGlobs = dirs
      .filter((dir) => fs.existsSync(dir))
      .map((dir) => `${dir}/${Application.EXT_GLOB}`)

    return fg.sync(allGlobs)
  }
}
