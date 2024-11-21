import { RESOLVER, Lifetime } from 'awilix'
import { ForegroundColorName as ColorName } from 'chalk'
import chalk from 'chalk-template'
import { ConsolaInstance, LogType, InputLogObject } from 'consola'

type LineOptions = {
  type?: LogType
  color?: ColorName | string
  title?: string
  date?: boolean
}

export default class OutputFormatter {
  static [RESOLVER] = {
    lifetime: Lifetime.SCOPED,
  }

  constructor(private consola: ConsolaInstance) {}

  /**
   * Build a line to be outputted to the console
   */
  buildLine(
    text: string,
    { color = 'reset', title }: Pick<LineOptions, 'color' | 'title'> = {},
  ): string {
    const titleBox = title ? chalk`{inverse  ${title} }` : ''
    const content = `${titleBox} ${text}`.trim()
    return chalk`{${color} ${content}}`
  }

  /**
   * Log a line to the console
   */
  log(
    text: string,
    { type = 'log', color = 'reset', title, date }: LineOptions = {},
  ): OutputFormatter {
    const coloredText = this.buildLine(text, { color, title })

    const options: InputLogObject = {}
    if (date) {
      options['date'] = new Date()
    }

    this.consola.withDefaults(options)[type](coloredText)
    return this
  }

  /**
   * Output a title with a separator.
   */
  title(
    text: string,
    { color, title, date = true }: Omit<LineOptions, 'type'> = {},
  ) {
    this.log(text, {
      title,
      date,
      color,
    }).separator(color)
  }

  /**
   * Output a subtitle with a separator.
   */
  subtitle(
    text: string,
    { color = 'dim', title, date = false }: Omit<LineOptions, 'type'> = {},
  ) {
    return this.log(text, {
      title,
      color,
      date,
    }).separator(`${color}.dim`)
  }

  /**
   * Output a separator.
   */
  separator(color = 'dim', width: number = process.stdout.columns) {
    // eslint-disable-next-line no-console
    console.log(process.stdout.columns)
    const separator = '─'.repeat(width > 0 ? width : 1)

    return this.log(chalk`{${color} ${separator}}`)
  }

  /**
   * Output a new line.
   */
  newLine(): OutputFormatter {
    this.log('')
    return this
  }

  /**
   * Output a success message.
   */
  success(text: string, title?: string) {
    return this.log(text, {
      type: 'success',
      title: title,
      color: 'green',
    })
  }

  /**
   * Output a warning message.
   */
  warning(text: string, title?: string) {
    return this.log(text, {
      type: 'warn',
      color: 'yellow',
      title: title,
    })
  }

  /**
   * Output an error message.
   */
  error(text: string | Error, title?: string) {
    if (text instanceof Error) {
      this.consola.error(text)
    } else {
      this.log(text, { type: 'error', title: title, color: 'red' })
    }
    return this
  }

  /**
   * Output an information message.
   */
  info(text: string, title?: string) {
    return this.log(text, { type: 'info', title: title, color: 'blue' })
  }

  /**
   * Output a debug message
   */
  debug(text: string, title?: string) {
    return this.log(text, { type: 'debug', title: title, color: 'dim' })
  }

  /**
   * Output start with a separator
   */
  start(text: string, title?: string) {
    return this.log(text, {
      title,
      type: 'start',
      color: 'magenta',
      date: true,
    }).separator('magenta.dim')
  }
}
