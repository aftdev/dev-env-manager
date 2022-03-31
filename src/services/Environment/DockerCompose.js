import AbstractEnvironment from '#services/Environment/AbstractEnvironment'
import FilebasedServiceMixin from '#src/mixins/FilebasedServiceMixin'

/**
 * Docker composer goodies.
 */
export default class DockerCompose extends AbstractEnvironment {
  static COMMAND = 'docker-compose'
  static CONFIG_ARGUMENT = '--file'
  static CONFIG_FILE = 'docker-compose.yml'

  #containers

  constructor(commandExecuter, configFiles = []) {
    super(commandExecuter)
    this.setConfigFiles(configFiles)
  }

  /**
   * Get list of potentials targets to connect to.
   *
   * @returns { Array }
   */
  getTargets() {
    if (this.#containers != undefined) {
      return this.#containers
    }

    this.#containers = []

    if (this.isEnabled()) {
      const services = this.execute(
        ['ps', '--services'],
        {},
        'backgroundExecute',
      )

      this.#containers = services
        .toString()
        .trim()
        .split('\n')
        .filter((n) => n)
    }

    return this.#containers
  }

  /**
   * Returns true if a container exists.
   *
   * @param {string} container
   * @returns {boolean}
   */
  hasContainer(container) {
    const containers = this.getTargets()

    return containers.indexOf(container) !== -1
  }

  /**
   * Execute a command on the given container.
   *
   * @param {string} container
   * @param {Array} commandArgs
   * @param {object} options - (type, root).
   * @returns
   */
  containerExecute(container, commandArgs = [], options = {}) {
    options.container = container
    options.type ??= 'exec'

    return this.execute(commandArgs, options)
  }

  /**
   * Execute a docker compose command.
   *
   * @param {Array} commandArgs
   * @param {object} options - (container, root, type).
   * @param {object} type - What commandExecuter command to use.
   */
  execute(commandArgs = [], options = {}, type = 'execute') {
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
   *
   * @param {Array} args
   * @param {object} type - What commandExecuter command to use.
   * @returns
   */
  dockerComposeCommand(args, type = 'execute') {
    return this._commandExecuter[type](
      this.constructor.COMMAND,
      this.injectServiceConfig(args),
    )
  }

  /**
   * Connect to container.
   *
   * @param {object} options
   * @returns {object}
   */
  connect(options = {}) {
    const container = options.target || false
    if (!container) {
      throw 'Please specify target'
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
  status() {
    this.dockerComposeCommand(['ps'])
  }

  /**
   * Start the containers.
   */
  start() {
    this.dockerComposeCommand(['up', '-d'])
  }

  /**
   * Stop the containers.
   */
  stop() {
    this.dockerComposeCommand(['down'])
  }

  /**
   * Build all the containers.
   */
  setup() {
    this.dockerComposeCommand(['build'])
  }
}

Object.assign(DockerCompose.prototype, FilebasedServiceMixin)
