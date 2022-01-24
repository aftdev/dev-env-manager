import chalk from 'chalk'
import commander from 'commander'

/**
 * Create and configure the main "commander" cli.
 *
 * @returns {Command}
 */
export default function (configuration, packageManagerScripts) {
  return new commander.Command('dev')
    .description(configuration.get('name'))
    .enablePositionalOptions()
    .passThroughOptions()
    .showSuggestionAfterError()
    .configureHelp({
      sortOptions: true,
      sortSubcommands: true,
    })
    .addHelpText('after', ({ command: cli }) => {
      const allScripts = packageManagerScripts.getScripts()
      let help = ''

      allScripts.forEach((scripts, manager) => {
        if (scripts.size == 0) {
          return
        }
        let managerScriptHelp = ''
        scripts.forEach((script) => {
          // Do not show commands defined on the cli object has they wont
          // be able to be executed.
          if (!cli._findCommand(script)) {
            managerScriptHelp += chalk.white(`\n  ${script}`)
          }
        })

        if (managerScriptHelp) {
          help += chalk.white(`\n${manager}:`) + managerScriptHelp
        }
      })

      if (help) {
        help = chalk.cyan('\nPackage manager commands:') + help
      }

      return help
    })
}
