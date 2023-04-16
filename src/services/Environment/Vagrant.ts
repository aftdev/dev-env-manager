import fs from 'fs'
import type { CommandArgs, ExecutionType } from '#services/CommandExecuter.js'
import AbstractEnvironment from '#services/Environment/AbstractEnvironment.js'

export type VagrantExecuteOptions = {
  machine?: string
}

export type VagrantConnectOptions = {
  target?: string
}

export default class Vagrant extends AbstractEnvironment {
  static COMMAND = 'vagrant'
  static CONFIG_FILE = 'Vagrantfile'

  private machines?: Array<string>

  override isEnabled() {
    return fs.existsSync(Vagrant.CONFIG_FILE)
  }

  /**
   * Get list of potentials targets to connect to.
   */
  getTargets(): Array<string> {
    if (this.machines != undefined) {
      return this.machines
    }

    this.machines = []

    if (this.isEnabled()) {
      const services = this.vagrantCommand(
        ['status', '--machine-readable'],
        'backgroundExecute',
      )

      this.machines = services
        .toString()
        .trim()
        .split('\n')
        .map((n: string) => n.split(','))
        .filter((n: Array<string>) => n[2] === 'state' && n[3] === 'running')
        .map((n: Array<string>) => n[1])
    }

    return this.machines || []
  }

  /**
   * Returns true if a machine exists.
   */
  hasMachine(machine: string): boolean {
    return this.getTargets().indexOf(machine) !== -1
  }

  /**
   * Execute a command on a machine.
   */
  override execute(
    commandArgs: CommandArgs,
    options: VagrantExecuteOptions = {},
  ) {
    const machine = options.machine || 'default'

    const args = ['ssh', machine, '-c', ...commandArgs]

    return this.vagrantCommand(args)
  }

  /**
   * Execute Vagrant command.
   */
  vagrantCommand(args: CommandArgs, type: ExecutionType = 'execute') {
    return this.commandExecuter[type](Vagrant.COMMAND, args)
  }

  /**
   * Connect to a machine.
   */
  override connect(options: VagrantConnectOptions = {}) {
    const machine = options.target || false
    if (!machine) {
      throw new Error('Please specify machine')
    }

    return this.vagrantCommand(['ssh', machine], 'tty')
  }

  /**
   * Return status of containers.
   */
  override status() {
    this.vagrantCommand(['status'])
  }

  /**
   * Start the machines.
   */
  override start() {
    this.vagrantCommand(['up'])
  }

  /**
   * Stop the machines.
   */
  override stop() {
    this.vagrantCommand(['halt'])
  }

  /**
   * Provision all the machines.
   */
  override setup() {
    this.vagrantCommand(['up', '--provision'])
  }
}
