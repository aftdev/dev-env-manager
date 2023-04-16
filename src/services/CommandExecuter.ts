import child_process, { ExecSyncOptionsWithBufferEncoding } from 'child_process'
import { RESOLVER, Lifetime } from 'awilix'
import chalkTemplate from 'chalk-template'
// @ts-expect-error: puka does not have types
import { sh, unquoted } from 'puka'
import type OutputFormatter from './OutputFormatter.js'

export type CommandArgs = Array<
  Array<string> | string | { [key: string]: Array<string> | string }
>

export type ExecutionType = Extract<
  keyof CommandExecuter,
  'tty' | 'execute' | 'backgroundExecute'
>

/**
 * TODO: consider using execa - with verbose mode ?
 */
export default class CommandExecuter {
  static [RESOLVER] = {
    lifetime: Lifetime.SCOPED,
  }

  constructor(private outputFormatter: OutputFormatter) {}

  /**
   * Properly quote command arguments using puka library.
   *
   * @see https://www.npmjs.com/package/puka#arrays-and-iterables
   */
  quoteCommandArgs(args: CommandArgs = []) {
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

  /**
   * Display the given command string.
   */
  displayCommand(command: string) {
    this.outputFormatter.output(
      chalkTemplate`{magentaBright.bold › Executing:} {white.dim ${command}}\n`,
    )
  }

  /**
   * Open shell tty process.
   */
  tty(command: string, args: CommandArgs = []) {
    const quotedArgs = this.quoteCommandArgs(args)
    this.displayCommand(`${command} ${args}`)

    return child_process.spawnSync(command, quotedArgs.split(' '), {
      stdio: 'inherit',
      shell: true,
    })
  }

  /**
   * Execute command and display it on screen.
   */
  execute(command: string, args: CommandArgs = []) {
    return this.executeSubProcess(command, args, {
      // in, out, error
      stdio: 'inherit',
    })
  }

  /**
   * Quietly execute command and return result.
   */
  backgroundExecute(command: string, args: CommandArgs = []) {
    return this.executeSubProcess(command, args, {}, false)
  }

  /**
   * Execute command (synchronously).
   *
   * @param options - That will be forwarded to the child_process.execSync function.
   * @param showCommand - Display the command that is executed.
   */
  private executeSubProcess(
    command: string,
    args: CommandArgs = [],
    options: ExecSyncOptionsWithBufferEncoding = {},
    showCommand = true,
  ) {
    const fullCommand = `${command} ${this.quoteCommandArgs(args)}`.trim()
    if (showCommand) {
      this.displayCommand(fullCommand)
    }

    return child_process.execSync(fullCommand, options)
  }
}
