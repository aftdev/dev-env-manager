import { RESOLVER, Lifetime } from 'awilix'
import chalk from 'chalk-template'
import extractStack from 'extract-stack'

export default class OutputFormatter {
  static [RESOLVER] = {
    lifetime: Lifetime.SCOPED,
  }

  static icons = {
    info: 'ℹ',
    success: '✔',
    warning: '⚠',
    error: '✖',
    separator: '─',
    titleSeparator: '−',
    dash: '╌',
  }

  constructor(private out = process.stdout) {}

  /**
   * Output a string.
   */
  output(value: string): OutputFormatter {
    this.out.write(`${value}\n`)
    return this
  }

  /**
   * Output a title.
   */
  title(text: string, color = 'green') {
    return this.separator(color, OutputFormatter.icons.titleSeparator)
      .output(chalk`{${color}.bold ${text}}`)
      .separator(color, OutputFormatter.icons.titleSeparator)
  }

  /**
   * Output a subtitle.
   */
  subtitle(text: string, color = 'yellow') {
    return this.output(chalk`{${color} ${text}}`).separator(
      color,
      OutputFormatter.icons.dash,
    )
  }

  /**
   * Output a separator.
   */
  separator(
    color = 'white.dim',
    type: string = OutputFormatter.icons.separator,
  ) {
    const separator = type.repeat(process.stdout.columns)

    return this.output(chalk`{${color} ${separator}}`)
  }

  /**
   * Output a new line.
   */
  newLine() {
    return this.output('')
  }

  /**
   * Output a colored line with optional title and icon.
   */
  line(text: string, color = 'white', title = '', icon = '') {
    let lineTitle = `${icon || ''} ${title || ''}`.trim()
    lineTitle = lineTitle ? chalk`{bold ${lineTitle}: }` : ''

    return this.output(chalk`{${color} ${lineTitle}${text}}`)
  }

  /**
   * Output a success message.
   */
  success(text: string, title?: string) {
    return this.line(
      text,
      'green',
      title || 'Success',
      OutputFormatter.icons.success,
    )
  }

  /**
   * Output a warning message.
   */
  warning(text: string, title?: string) {
    return this.line(
      text,
      'yellow',
      title || 'Warning',
      OutputFormatter.icons.warning,
    )
  }

  /**
   * Output an error message.
   */
  error(text: string, title?: string) {
    return this.line(text, 'red', title || 'Error', OutputFormatter.icons.error)
  }

  /**
   * Output an information message.
   */
  info(text: string, title?: string) {
    return this.line(text, 'blue', title || 'Info', OutputFormatter.icons.error)
  }

  /**.
   * Output nicely formatter message from Error object.
   *
   * Only display the error stack if the error has been triggered by the
   * main process (and not a child_process)
   */
  renderError(error: string | Error) {
    const message = error instanceof Error ? error.message : error
    const name = error instanceof Error ? error.name : undefined

    if (!message) {
      return ''
    }

    const messages = message.split(/\r?\n/).map((message) => message.trim())

    const errorTitle = messages.shift() || ''
    this.error(errorTitle, name)

    // Multiline error messages.
    const redColor = 'red'
    const whiteColor = 'white.dim'

    if (messages.length) {
      this.separator(redColor, OutputFormatter.icons.dash)
        .line(messages.join('\n'), redColor)
        .newLine()
    }

    // Stack
    const stack = extractStack(error)
    if (stack) {
      this.line('Stack:', whiteColor)
        .separator(whiteColor, OutputFormatter.icons.dash)
        .line(stack, whiteColor)
        .separator(whiteColor, OutputFormatter.icons.dash)
        .newLine()
    }
  }
}
