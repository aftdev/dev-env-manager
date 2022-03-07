import child_process from 'child_process'
import { RESOLVER, Lifetime } from 'awilix'
import chalk from 'chalk'
import { sh, unquoted } from 'puka'

export default class CommandExecuter {
  #outputFormatter

  constructor(outputFormatter) {
    this.#outputFormatter = outputFormatter
  }

  /**
   * Properly quote command arguments using puka library.
   *
   * @param {Array} args
   *
   * @returns {string}
   *
   * @see https://www.npmjs.com/package/puka#arrays-and-iterables
   */
  quoteCommandArgs(args = []) {
    const quotableArgs = []
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
   *
   * @param {string} command
   */
  displayCommand(command) {
    this.#outputFormatter.output(
      chalk`{magentaBright.bold › Executing:} {white.dim ${command}}\n`,
    )
  }

  /**
   * Open shell tty process.
   *
   * @param {string} command
   * @param {Array} args
   * @returns {object}
   */
  tty(command, args = []) {
    args = this.quoteCommandArgs(args)
    this.displayCommand(`${command} ${args}`)

    return child_process.spawnSync(command, args.split(' '), {
      stdio: 'inherit',
      shell: true,
    })
  }

  /**
   * Execute command and display it on screen.
   *
   * @param {string} command
   * @param {Array} args
   */
  execute(command, args = []) {
    return this.#executeSubProcess(command, args, {
      // in, out, error
      stdio: 'inherit',
    })
  }

  /**
   * Quietly execute command and return result.
   *
   * @param {string} command
   * @param {Array} args
   */
  backgroundExecute(command, args = []) {
    return this.#executeSubProcess(command, args, {}, false)
  }

  /**
   * Execute command (synchronously).
   *
   * @param {string} command
   * @param {Array} args
   * @param {object} options - That will be forwarded to the child_process.execSync function.
   * @param {boolean} showCommand - Display the command that is executed.
   */
  #executeSubProcess(command, args = [], options = {}, showCommand = true) {
    const fullCommand = `${command} ${this.quoteCommandArgs(args)}`.trim()
    if (showCommand) {
      this.displayCommand(fullCommand)
    }

    return child_process.execSync(fullCommand, options)
  }
}

// DI info
CommandExecuter[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
