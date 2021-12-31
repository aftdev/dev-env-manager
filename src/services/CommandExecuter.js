import child_process from 'child_process'
import { RESOLVER, Lifetime } from 'awilix'
import chalk from 'chalk'
import Output from './OutputFormatter.js'

export default class CommandExecuter {
  #executables
  #outputFormatter

  constructor(executables, outputFormatter) {
    this.#executables = executables
    this.#outputFormatter = outputFormatter
  }

  /**
   * Properly quote command arguments.
   *
   * @param {Array} args
   */
  quoteCommandArgs(args) {
    return args
      .map((arg) => (arg.includes(' ') ? `'${arg}'` : arg))
      .join(' ')
      .trim()
  }

  /**
   * Return the command to be run (with target and options).
   *
   * @param {string} executable
   * @param {Array} args
   * @param {Array} commandAlreadyParsed - Internally used for circular dependency fail safe.
   * @returns
   */
  getCommandFor(executable, args = [], commandAlreadyParsed = []) {
    const commandConfig = this.#executables[executable] || executable

    const command =
      typeof commandConfig === 'string'
        ? commandConfig
        : commandConfig.command || executable

    const targetConfiguration = commandConfig.use || null

    // Check Target.
    let targetCommand = ''
    if (targetConfiguration) {
      const target =
        typeof targetConfiguration === 'string'
          ? targetConfiguration
          : targetConfiguration.target || null

      if (target) {
        // Safe Guard against cycle dependencies.
        if (commandAlreadyParsed.includes(target)) {
          throw new RangeError('Circular dependency error !')
        }
        commandAlreadyParsed.push(command)

        const targetArguments = targetConfiguration.with || []

        targetCommand = this.getCommandFor(
          target,
          targetArguments instanceof Array
            ? targetArguments
            : [targetArguments],
          commandAlreadyParsed,
        )
      }
    }

    return `${targetCommand} ${command} ${this.quoteCommandArgs(args)}`.trim()
  }

  /**
   * Display and execute a command.
   *
   * @param {string} commandType
   * @param {Array} args
   * @param {boolean} catchError
   * @param {string} stdio
   * @returns
   */
  execute(commandType, args = [], catchError = true, stdio = 'inherit') {
    const command = this.getCommandFor(commandType, args)

    this.#outputFormatter.output(
      chalk`{magentaBright ${Output.SEPARATOR_DASH}\n{magentaBright.bold Executing:} {white ${command}}\n${Output.SEPARATOR_DASH}}\n`,
    )

    try {
      return child_process.execSync(command, { stdio })
    } catch (err) {
      if (catchError) {
        if (err.status != 130) {
          this.exitScriptWithError(err.message)
        }
      } else {
        throw err
      }
    }
  }

  /**.
   * Quietly execute command and return result
   *
   * @param {String} commandType
   * @param {Array} args
   * @returns
   */
  backgroundExecute(commandType, args = []) {
    const command = this.getCommandFor(commandType, args)

    return child_process.execSync(command)
  }

  /**
   * Display an error message and end script execution.
   *
   * @param {string} errorMessage
   * @param {Integer} code
   */
  exitScriptWithError(errorMessage = null, code = 1) {
    if (errorMessage) {
      this.#outputFormatter.error(errorMessage)
    }

    process.exit(code)
  }
}

// DI info
CommandExecuter[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
