import type { CommandArgs } from '#services/Command'
import Command from '#services/Command'
import CommandExecuter from '#services/CommandExecuter'
import AbstractEnvironment, {
  EnvironmentOptions,
} from '#services/Environment/AbstractEnvironment'
import FileConfigArgs from '#services/FileConfigArgs'

export interface DockerComposeEnvOptions extends EnvironmentOptions {
  config_files: Array<string>
}

export const dockerExecType = ['run', 'exec']

export type DockerComposeExecuteOptions = {
  container?: string
  root?: boolean
  type?: (typeof dockerExecType)[number]
}

export type DockerComposeConnectOptions = {
  root?: boolean
  target: string
}

/**
 * Docker composer goodies.
 */
export default class DockerCompose extends AbstractEnvironment {
  static COMMAND = 'docker compose'
  static CONFIG_ARGUMENT = '--file'
  static CONFIG_FILE = 'docker-compose.yml'

  private containers?: Array<string>
  private fileConfigArgsService: FileConfigArgs

  constructor(
    commandExecuter: CommandExecuter,
    configFiles: Array<string> = [],
  ) {
    super(commandExecuter)
    this.fileConfigArgsService = new FileConfigArgs(
      configFiles,
      DockerCompose.CONFIG_FILE,
      DockerCompose.CONFIG_ARGUMENT,
    )
  }

  override isEnabled(): boolean {
    return this.fileConfigArgsService.configFilesExists()
  }

  /**
   * Get list of potentials targets to connect to.
   */
  getTargets(): Array<string> {
    if (this.containers != undefined) {
      return this.containers
    }

    this.containers = []

    if (this.isEnabled()) {
      const serviceCommands = this.command(['ps', '--services'])
      this.containers = serviceCommands.quiet().lines()
    }

    return this.containers
  }

  /**
   * Returns true if a container exists.
   */
  hasContainer(container: string): boolean {
    const containers = this.getTargets()

    return containers.indexOf(container) !== -1
  }

  /**
   * Build a docker compose command
   */
  command(
    args: CommandArgs,
    commandOptions: DockerComposeExecuteOptions = {},
  ): Command {
    const fullArgs: CommandArgs =
      this.fileConfigArgsService.getConfigArguments()

    // Container related options
    if (commandOptions.container) {
      fullArgs.push(commandOptions.type || 'exec')

      if (commandOptions.root) {
        fullArgs.push({ '--user': 'root' })
      }

      fullArgs.push(commandOptions.container)
    }

    return this.commandExecuter.command(DockerCompose.COMMAND, [
      ...fullArgs,
      ...args,
    ])
  }

  /**
   * Execute a docker compose command.
   */
  override execute(
    commandArgs: CommandArgs = [],
    options: DockerComposeExecuteOptions = {},
  ) {
    return this.command(commandArgs, options).execute()
  }

  /**
   * Execute a command on the given container.
   */
  containerExecute(
    container: string,
    commandArgs: CommandArgs = [],
    options: DockerComposeExecuteOptions = {},
  ) {
    options.container = container
    options.type ??= 'exec'

    return this.command(commandArgs, options).execute()
  }

  /**
   * Connect to container.
   */
  override connect(options: DockerComposeConnectOptions) {
    const container = options.target || false
    if (!container) {
      throw new Error('Please specify target')
    }

    return this.command(['bash'], {
      container,
      root: options.root || false,
    }).tty()
  }

  /**
   * Return status of containers.
   */
  override status() {
    this.command(['ps']).execute()
  }

  /**
   * Start the containers.
   */
  override start() {
    this.command(['up', '-d']).execute()
  }

  /**
   * Stop the containers.
   */
  override stop() {
    this.command(['down']).execute()
  }

  /**
   * Build all the containers.
   */
  override setup() {
    this.command(['up', '-d', '--build']).execute()
  }
}
