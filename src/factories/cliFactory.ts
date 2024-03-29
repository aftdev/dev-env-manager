import chalk from 'chalk'
import { Command } from 'commander'
import type { Provider } from 'nconf'
import type PackageManagerScript from '#services/PackageManagerScript.js'

/**
 * Create and configure the main "commander" cli.
 */
export default function (
  configuration: Provider,
  packageManagerScripts: PackageManagerScript,
) {
  return new Command()
    .name('dev')
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
          // @ts-expect-error: use private commander function.
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
