import { RESOLVER, Lifetime } from 'awilix'
import OutputFormatter from './OutputFormatter'
import Command, { CommandArgs, CommandOptions } from '#services/Command.js'

export type ExecutionType = Extract<
  keyof CommandExecuter,
  'tty' | 'execute' | 'backgroundExecute'
>

export default class CommandExecuter {
  static [RESOLVER] = {
    lifetime: Lifetime.SCOPED,
  }

  constructor(private outputFormatter: OutputFormatter) {}

  /**
   * Build an executable Command instance
   */
  command(
    command: string,
    args: CommandArgs = [],
    options: Partial<CommandOptions> = {},
  ): Command {
    return new Command(command, args, options, this.outputFormatter)
  }

  /**
   * Execute a command and display it on screen.
   */
  execute(command: string, args: CommandArgs = []): void {
    this.command(command, args).execute()
  }

  /**
   * Open shell tty process.
   */
  tty(command: string, args: CommandArgs = []) {
    return this.command(command, args).tty()
  }

  /**
   * Quietly execute command and return result.
   */
  backgroundExecute(command: string, args: CommandArgs = []): Buffer {
    return this.command(command, args, {
      displayCommand: false,
    }).executeInBackground()
  }
}
