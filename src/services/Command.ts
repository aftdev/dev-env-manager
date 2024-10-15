import child_process from 'child_process'
import chalkTemplate from 'chalk-template'
// @ts-expect-error: puka does not have types
import { sh, unquoted } from 'puka'
import OutputFormatter from '#services/OutputFormatter.js'

export type CommandOptions = {
  displayCommand?: boolean
}

export type CommandArgs = Array<
  Array<string> | string | { [key: string]: Array<string> | string }
>

/**
 * Command helper to build and execute commands easily.
 */
export default class Command {
  private options: Required<CommandOptions> = {
    displayCommand: true,
  }

  private commandString: string

  constructor(
    command: string,
    args: CommandArgs = [],
    options: CommandOptions = {},
    private outputFormatter?: OutputFormatter,
  ) {
    Object.assign(this.options, options || {})

    this.commandString = this.buildCommand(command, args)
  }

  /**
   * Do not display command
   */
  public quiet(): Command {
    this.options.displayCommand = false
    return this
  }

  public execute(): void {
    this.displayCommand()

    child_process.execSync(this.commandString, {
      stdio: 'inherit',
    })
  }

  public tty() {
    this.displayCommand()

    return child_process.spawnSync(this.commandString, [], {
      stdio: 'inherit',
      shell: true,
    })
  }

  /**
   * Return Hash from Json output.
   */
  public json(): object {
    const output = this.executeInBackground()

    return JSON.parse(output.toString().trim())
  }

  /**
   * Return an array of strings from command output
   */
  public lines(separator = '\n'): Array<string> {
    const output = this.executeInBackground()

    return output
      .toString()
      .split(separator)
      .map((l) => l.trim())
      .filter((l: string) => l)
  }

  /**
   * Execute command and return output buffer.
   */
  public executeInBackground(): Buffer {
    this.displayCommand()

    return child_process.execSync(this.commandString, {})
  }

  private buildCommand(command: string, args: CommandArgs = []): string {
    return `${command} ${Command.quoteCommandArgs(args)}`.trim()
  }

  private displayCommand() {
    if (!this.options.displayCommand) {
      return
    }

    this.outputFormatter?.start(
      chalkTemplate`{reset.dim ${this.commandString}}`,
      'Executing',
    )
  }

  /**
   * Properly quote command arguments using puka library.
   *
   * @see https://gitlab.com/rhendric/puka#arrays-and-iterables
   */
  static quoteCommandArgs(args: CommandArgs = []): string {
    const quotableArgs: Array<string> = []
    args.forEach((arg) => {
      // If object go through each key and each value
      if (arg instanceof Array || typeof arg === 'string') {
        quotableArgs.push(sh`${arg}`)
      } else if (arg instanceof Object) {
        for (const key in arg) {
          const isLongKey = key.startsWith('--')
          const values = arg[key] instanceof Array ? arg[key] : [arg[key]]
          const formattedKey = isLongKey
            ? `${key}=`
            : !key.startsWith('-')
              ? `-${key} `
              : `${key} `

          quotableArgs.push(sh`${unquoted(formattedKey)}${values}`)
        }
      }
    })

    return quotableArgs.join(' ')
  }
}
