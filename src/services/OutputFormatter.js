import { RESOLVER, Lifetime } from 'awilix'
import chalk from 'chalk'

export default class OutputFormatter {
  static SEPARATOR = '==========================='
  static SEPARATOR_DASH = '------------------------'

  #out

  constructor(out = process.stdout) {
    this.#out = out
  }

  output(string) {
    this.#out.write(`${string}\n`)
  }

  title(text, color = 'green') {
    this.output(
      chalk`{${color}.bold ${OutputFormatter.SEPARATOR}\n${text} \n${OutputFormatter.SEPARATOR}}\n`,
    )
  }

  subtitle(text, color = 'yellow') {
    this.output(chalk`{${color} ${text}\n${OutputFormatter.SEPARATOR}} \n`)
  }

  success(text) {
    this.output(
      chalk`{green ${OutputFormatter.SEPARATOR} \n{bold ✔ Success:} ${text} \n${OutputFormatter.SEPARATOR}}`,
    )
  }

  warning(text) {
    this.output(
      chalk`{yellow ${OutputFormatter.SEPARATOR} \n{bold ⚠️ Warning:} ${text} \n${OutputFormatter.SEPARATOR}}`,
    )
  }

  error(text) {
    const message = chalk`{red ❌ Error: ${text}}`
    this.output(message)
  }
}

// DI info
OutputFormatter[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
