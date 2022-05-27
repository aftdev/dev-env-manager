import { RESOLVER, Lifetime } from 'awilix'
import chalk from 'chalk-template'
import extractStack from 'extract-stack'

export default class OutputFormatter {
  static icons = {
    info: 'ℹ',
    success: '✔',
    warning: '⚠',
    error: '✖',
    separator: '─',
    titleSeparator: '−',
    dash: '╌',
  }

  #out

  constructor(out = process.stdout) {
    this.#out = out
  }

  /**
   * Output a string.
   *
   * @param {string} string
   */
  output(string) {
    this.#out.write(`${string}\n`)
    return this
  }

  /**
   * Output a title.
   *
   * @param {string} text
   * @param {string} color
   */
  title(text, color = 'green') {
    return this.separator(color, OutputFormatter.icons.titleSeparator)
      .output(chalk`{${color}.bold ${text}}`)
      .separator(color, OutputFormatter.icons.titleSeparator)
  }

  /**
   * Output a subtitle.
   *
   * @param {string} text
   * @param {*} color
   */
  subtitle(text, color = 'yellow') {
    return this.output(chalk`{${color} ${text}}`).separator(
      color,
      OutputFormatter.icons.dash,
    )
  }

  /**
   * Output a separator.
   *
   * @param {string} color
   * @param {string} type
   */
  separator(color = 'white.dim', type = OutputFormatter.icons.separator) {
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
   *
   * @param {string} text
   * @param {string} color
   * @param {string} title
   * @param {string} icon
   */
  line(text, color = 'white', title = '', icon = '') {
    let lineTitle = `${icon || ''} ${title || ''}`.trim()
    lineTitle = lineTitle ? chalk`{bold ${lineTitle}: }` : ''

    return this.output(chalk`{${color} ${lineTitle}${text}}`)
  }

  /**
   * Output a success message.
   *
   * @param {string} text
   * @param {string | null} title
   */
  success(text, title = null) {
    return this.line(
      text,
      'green',
      title || 'Success',
      OutputFormatter.icons.success,
    )
  }

  /**
   * Output a warning message.
   *
   * @param {string} text
   * @param {string | null} title
   */
  warning(text, title = null) {
    return this.line(
      text,
      'yellow',
      title || 'Warning',
      OutputFormatter.icons.warning,
    )
  }

  /**
   * Output an error message.
   *
   * @param {string} text
   * @param {string | null} title
   */
  error(text, title = null) {
    return this.line(text, 'red', title || 'Error', OutputFormatter.icons.error)
  }

  /**
   * Output an information message.
   *
   * @param {string} text
   * @param {string | null} title
   */
  info(text, title = null) {
    return this.line(text, 'blue', title || 'Info', OutputFormatter.icons.error)
  }

  /**.
   * Output nicely formatter message from Error object.
   *
   * Only display the error stack if the error has been triggered by the
   * main process (and not a child_process)
   *
   * @param {Object} error
   *
   * @return String
   */
  renderError(error) {
    const message = error instanceof Error ? error.message : error
    if (!message) {
      return ''
    }

    const messages = message.split(/\r?\n/).map((message) => message.trim())

    const errorTitle = messages.shift()
    this.error(errorTitle, error.name)

    // Multiline error messages.
    const redColor = 'red'
    const whiteColor = 'white.dim'

    if (messages.length) {
      this.separator(redColor, OutputFormatter.icons.dash)
        .line(messages.join('\n'), redColor)
        .newLine()
    }

    // Stack
    const pid = error.pid || process.pid
    if (pid === process.pid) {
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
}

// DI info
OutputFormatter[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
