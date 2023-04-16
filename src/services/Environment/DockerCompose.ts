import CommandExecuter, {
  CommandArgs,
  ExecutionType,
} from '../CommandExecuter.js'
import FileConfigArgs from '../FileConfigArgs.js'
import AbstractEnvironment, {
  EnvironmentOptions,
} from '#services/Environment/AbstractEnvironment.js'

export interface DockerComposeEnvOptions extends EnvironmentOptions {
  config_files: Array<string>
}

export type DockerComposeOptions = {
  root?: boolean
  container?: string
}

export const dockerExecType = ['run', 'exec']

export type DockerComposeExecuteOptions = DockerComposeOptions & {
  type?: (typeof dockerExecType)[number]
}

export type DockerComposeConnectOptions = DockerComposeOptions & {
  target?: string
}

/**
 * Docker composer goodies.
 */
export default class DockerCompose extends AbstractEnvironment {
  static COMMAND = 'docker-compose'
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
      const services = this.execute(
        ['ps', '--services'],
        {},
        'backgroundExecute',
      )

      this.containers = services
        .toString()
        .trim()
        .split('\n')
        .filter((n: string) => n)
    }

    return this.containers || []
  }

  /**
   * Returns true if a container exists.
   */
  hasContainer(container: string): boolean {
    const containers = this.getTargets()

    return containers.indexOf(container) !== -1
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

    return this.execute(commandArgs, options)
  }

  /**
   * Execute a docker compose command.
   */
  override execute(
    commandArgs: CommandArgs = [],
    options: DockerComposeExecuteOptions = {},
    type: ExecutionType = 'execute',
  ) {
    const rootParam = options.root || false ? { '--user': 'root' } : ''
    const container = options.container || ''
    // If we have a container we need to either exec or run
    const dockerCommandType = container ? options.type || 'exec' : ''

    return this.dockerComposeCommand(
      [dockerCommandType, rootParam, container, ...commandArgs],
      type,
    )
  }

  /**
   * Execute a docker compose command.
   */
  dockerComposeCommand(args: CommandArgs, type: ExecutionType = 'execute') {
    return this.commandExecuter[type](
      DockerCompose.COMMAND,
      this.fileConfigArgsService.injectServiceConfig(args),
    )
  }

  /**
   * Connect to container.
   */
  override connect(options: DockerComposeConnectOptions = {}) {
    const container = options.target || false
    if (!container) {
      throw new Error('Please specify target')
    }

    return this.execute(
      ['bash'],
      {
        container,
        root: options.root || false,
      },
      'tty',
    )
  }

  /**
   * Return status of containers.
   */
  override status() {
    this.dockerComposeCommand(['ps'])
  }

  /**
   * Start the containers.
   */
  override start() {
    this.dockerComposeCommand(['up', '-d'])
  }

  /**
   * Stop the containers.
   */
  override stop() {
    this.dockerComposeCommand(['down'])
  }

  /**
   * Build all the containers.
   */
  override setup() {
    this.dockerComposeCommand(['up', '-d', '--build'])
  }
}
