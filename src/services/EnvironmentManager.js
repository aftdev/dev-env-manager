import DockerCompose from '#services/Environment/DockerCompose'
import Local from '#services/Environment/Local'

export default class EnvironmentManager {
  static COMMAND = 'command'

  #container
  #configuration
  #environments = new Map()

  constructor(container, configuration = {}) {
    this.#container = container
    this.#configuration = configuration
  }

  /**
   * Get the environment.
   *
   * @param {string} envName
   * @returns {AbstractEnvironment}
   */
  get(envName) {
    if (!this.#environments.has(envName)) {
      this.#environments.set(envName, this.build(envName))
    }

    return this.#environments.get(envName)
  }

  /**
   * Return all the environments that match the criteria.
   *
   * @param {object<string, boolean>} criteria
   * @returns {Map} Map of environmentName -> environment matching criteria.
   */
  groupedBy(criteria = {}) {
    const environments = Object.entries(this.#configuration)
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
   * Execute command on configured environment.
   *
   * If no environment is configured it will be executed locally.
   *
   * @param {*} command
   */
  executeCommand(command, args = []) {
    const [envName, options] = this.#getCommandEnvironment(command)

    const env = this.get(envName)

    // allow override of the command.
    command = options.command || command

    args.unshift(command)

    return env.execute(args, options)
  }

  /**
   * Get the environment and the options needed to execute that command.
   *
   * @param {string} command
   * @returns {Array<string, object>}
   */
  #getCommandEnvironment(command) {
    const environment = Object.entries(this.#configuration).find(
      ([, config]) => (config.commands && config.commands[command]) || false,
    )

    if (environment) {
      const [
        env,
        {
          commands: { [command]: envOptions },
        },
      ] = environment

      return [env, envOptions]
    } else {
      return ['local', {}]
    }
  }

  build(envName) {
    const envConfig = this.#configuration[envName]
    const envType = envConfig['type'] || envName
    const buildOptions = envConfig['options'] || []

    switch (envType.toLowerCase()) {
      case 'dockercompose':
      case 'docker-compose':
        return this.buildDockerCompose(buildOptions)
      case 'local':
      default:
        return this.buildLocal()
    }
  }

  buildDockerCompose(options) {
    const configFiles = options['config_files'] || []

    return new DockerCompose(
      this.#container.resolve('commandExecuter'),
      configFiles,
    )
  }

  buildLocal() {
    return new Local(this.#container.resolve('commandExecuter'))
  }
}
