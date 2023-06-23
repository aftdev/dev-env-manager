import fs from 'fs'
import type { CommandArgs } from '#services/Command.js'
import Command from '#services/Command.js'
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
    return fs.existsSync('Vagrantfile')
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
      this.machines = this.command(['status', '--machine-readable'])
        .quiet()
        .lines()
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
   * Create Vagrant command.
   */
  command(args: CommandArgs, options: VagrantExecuteOptions = {}): Command {
    let commandArgs = args

    // Do we want to execute a command on a given machine?
    if (options.machine) {
      commandArgs = ['ssh', options.machine, '-c', ...commandArgs]
    }

    return this.commandExecuter.command(Vagrant.COMMAND, commandArgs)
  }

  /**
   * Execute a command on a machine.
   */
  override execute(
    commandArgs: CommandArgs,
    options: VagrantExecuteOptions = {},
  ) {
    options.machine ??= 'default'

    return this.command(commandArgs, options).execute()
  }

  /**
   * Connect to a machine.
   */
  override connect(options: VagrantConnectOptions = {}) {
    const machine = options.target || false
    if (!machine) {
      throw new Error('Please specify machine')
    }

    return this.command(['ssh', machine]).tty()
  }

  /**
   * Return status of containers.
   */
  override status() {
    this.command(['status']).execute()
  }

  /**
   * Start the machines.
   */
  override start() {
    this.command(['up']).execute()
  }

  /**
   * Stop the machines.
   */
  override stop() {
    this.command(['halt']).execute()
  }

  /**
   * Provision all the machines.
   */
  override setup() {
    this.command(['up', '--provision']).execute()
  }
}
