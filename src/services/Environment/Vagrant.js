import fs from 'fs'
import AbstractEnvironment from '#services/Environment/AbstractEnvironment'

export default class Vagrant extends AbstractEnvironment {
  static COMMAND = 'vagrant'
  static CONFIG_FILE = 'Vagrantfile'

  #machines

  isEnabled() {
    return fs.existsSync(this.constructor.CONFIG_FILE)
  }

  /**
   * Get list of potentials targets to connect to.
   *
   * @returns { Array }
   */
  getTargets() {
    if (this.#machines != undefined) {
      return this.#machines
    }

    this.#machines = []

    if (this.isEnabled()) {
      const services = this.execute(
        ['status', '--machine-readable'],
        {},
        'backgroundExecute',
      )

      this.#machines = services
        .toString()
        .trim()
        .split('\n')
        .map((n) => n.split(','))
        .filter((n) => n[2] == 'state' && n[3] === 'running')
        .map((n) => n[1])
    }

    return this.#machines
  }

  /**
   * Returns true if a machine exists.
   *
   * @param {string} machine
   * @returns {boolean}
   */
  hasMachine(machine) {
    return this.getTargets().indexOf(machine) !== -1
  }

  /**.
   * Execute a vagrant command
   *
   * @param {Array} commandArgs
   * @param {object} options - (machine).
   * @param {object} type - What commandExecuter command to use.
   */
  execute(commandArgs = [], options = {}, type = 'execute') {
    const machine = options.machine || ''

    // Do we want to execute the command on a machine ?
    const args = machine ? ['ssh', machine, '-c', commandArgs] : commandArgs

    return this._commandExecuter[type](this.constructor.COMMAND, args)
  }

  /**
   * Connect to container.
   *
   * @param {object} options
   * @returns {object}
   */
  connect(options = {}) {
    const machine = options.target || false
    if (!machine) {
      throw 'Please specify machine'
    }

    return this.execute(['ssh', machine], {}, 'tty')
  }

  /**
   * Return status of containers.
   */
  status() {
    this.execute(['status'])
  }

  /**
   * Start the containers.
   */
  start() {
    this.execute(['up'])
  }

  /**
   * Stop the containers.
   */
  stop() {
    this.execute(['halt'])
  }

  /**
   * Build all the containers.
   */
  setup() {
    this.execute(['up', '--provision'])
  }
}
