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
      const services = this.vagrantCommand(
        ['status', '--machine-readable'],
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

  /**
   * Execute a command on a machine.
   *
   * @param {Array} commandArgs
   * @param {object} options - (machine).
   */
  execute(commandArgs = [], options = {}) {
    const machine = options.machine || 'default'

    const args = ['ssh', machine, '-c', commandArgs]

    return this.vagrantCommand(args)
  }

  /**
   * Execute Vagrant command.
   *
   * @param {Array} args
   * @param {object} type - What commandExecuter command to use.
   * @returns
   */
  vagrantCommand(args, type = 'execute') {
    return this._commandExecuter[type](this.constructor.COMMAND, args)
  }

  /**
   * Connect to a machine.
   *
   * @param {object} options
   * @returns {object}
   */
  connect(options = {}) {
    const machine = options.target || false
    if (!machine) {
      throw 'Please specify machine'
    }

    return this.vagrantCommand(['ssh', machine], 'tty')
  }

  /**
   * Return status of containers.
   */
  status() {
    this.vagrantCommand(['status'])
  }

  /**
   * Start the machines.
   */
  start() {
    this.vagrantCommand(['up'])
  }

  /**
   * Stop the machines.
   */
  stop() {
    this.vagrantCommand(['halt'])
  }

  /**
   * Provision all the machines.
   */
  setup() {
    this.vagrantCommand(['up', '--provision'])
  }
}
