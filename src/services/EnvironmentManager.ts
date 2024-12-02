import type { AwilixContainer } from 'awilix'
import type { CommandArgs } from '#services/Command'
import AbstractEnvironment, {
  EnvironmentOptions,
} from '#services/Environment/AbstractEnvironment'
import DockerCompose, {
  DockerComposeEnvOptions,
} from '#services/Environment/DockerCompose'
import Local from '#services/Environment/Local'
import Vagrant from '#services/Environment/Vagrant'

export type CommandOptions = Record<string, unknown>
export interface EnvironmentConfiguration {
  type?: string
  groups?: Record<string, boolean>
  options?: EnvironmentOptions
  commands?: Record<string, CommandOptions>
}

export type ExtensionCallback = (
  arg0: EnvironmentOptions,
  arg1: AwilixContainer,
) => AbstractEnvironment

export default class EnvironmentManager {
  static COMMAND = 'command'

  private environments: Map<string, AbstractEnvironment> = new Map()
  private extensions: Map<string, ExtensionCallback> = new Map()

  constructor(
    private container: AwilixContainer,
    private configuration: Record<string, EnvironmentConfiguration> = {},
  ) {}

  /**
   * Get the environment.
   */
  public get(envName: string): AbstractEnvironment {
    if (!this.environments.has(envName)) {
      this.environments.set(envName, this.build(envName))
    }

    return this.environments.get(envName)!
  }

  /**
   * Return all the environments that match the criteria.
   */
  public groupedBy(
    criteria: { [key: string]: boolean } = {},
  ): Map<string, AbstractEnvironment> {
    const environments = Object.entries(this.configuration)
    return new Map(
      environments
        .filter(([, config]) => {
          for (const filter in criteria) {
            if (criteria[filter] !== (config.groups?.[filter] || false)) {
              return false
            }
          }
          return true
        })
        .map(([envName]) => [envName, this.get(envName)]),
    )
  }

  /**
   * Whether or not an environment can execute a command.
   */
  public canExecuteCommand(command: string): boolean {
    const [envName] = this.getCommandEnvironment(command)

    return !!envName
  }

  /**
   * Execute command on configured environment.
   *
   * If no environment is configured it will be executed locally.
   */
  public executeCommand(command: string, args: CommandArgs = []) {
    const [envName = 'local', options = {}] =
      this.getCommandEnvironment(command)

    const env = this.get(envName)
    // allow override of the command.
    command = (options.command || command) as string

    args.unshift(command)

    return env.execute(args, options)
  }

  /**
   * Extend the environment manager to allow custom environments.
   */
  public extend(name: string, factoryCallback: ExtensionCallback) {
    this.extensions.set(name, factoryCallback)
  }

  public build(envName: string): AbstractEnvironment {
    const envConfig = this.configuration[envName]
    if (!envConfig) {
      throw new Error(`Cannot build env [${envName}]: Unknown`)
    }

    const envType = envConfig.type || envName
    const buildOptions = (envConfig.options || {}) as EnvironmentOptions

    if (this.extensions.has(envType)) {
      const factoryCallback = this.extensions.get(envType) as ExtensionCallback
      return factoryCallback(buildOptions, this.container)
    }

    switch (envType.toLowerCase()) {
      case 'dockercompose':
      case 'docker-compose':
        return this.buildDockerCompose(buildOptions as DockerComposeEnvOptions)
      case 'vagrant':
        return this.buildVagrant()
      case 'local':
        return this.buildLocal()
    }

    throw new Error('Invalid environment type')
  }

  /**
   * Get the environment and the options needed to execute that command.
   */
  private getCommandEnvironment(
    command: string,
  ): [string, CommandOptions] | [] {
    const environment = Object.entries(this.configuration).find(
      ([, config]) => config?.commands?.[command] || false,
    )

    if (environment) {
      const [env, { commands }] = environment
      const envOptions = commands?.[command] || {}

      return [env, envOptions]
    } else {
      return []
    }
  }

  private buildDockerCompose(options: DockerComposeEnvOptions) {
    const configFiles = options['config_files'] || []

    return new DockerCompose(
      this.container.resolve('commandExecuter'),
      configFiles,
    )
  }

  private buildLocal() {
    return new Local(this.container.resolve('commandExecuter'))
  }

  private buildVagrant() {
    return new Vagrant(this.container.resolve('commandExecuter'))
  }
}
