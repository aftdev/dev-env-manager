import chalk from 'chalk'
import { Command } from 'commander'
import { ConsolaInstance } from 'consola'
import type { Provider } from 'nconf'
import OutputFormatter from '#services/OutputFormatter.js'
import type PackageManagerScript from '#services/PackageManagerScript.js'

/**
 * Create and configure the main "commander" cli.
 */
export default function (
  configuration: Provider,
  packageManagerScripts: PackageManagerScript,
  consola: ConsolaInstance,
  outputFormatter: OutputFormatter,
) {
  return new Command()
    .name('dev')
    .description(configuration.get('name'))
    .option('-d, --debug', 'Show debug information')
    .enablePositionalOptions()
    .passThroughOptions()
    .showSuggestionAfterError()
    .configureHelp({
      sortOptions: true,
      sortSubcommands: true,
    })
    .hook('preAction', (thisCommand) => {
      const { debug = false } = thisCommand.opts()
      if (debug) {
        consola.level = 999
      }
    })
    .addHelpText('after', ({ command: cli }) => {
      const allScripts = packageManagerScripts.getScripts()
      allScripts.forEach((scripts, manager) => {
        if (scripts.size == 0) {
          return
        }

        const managerScriptHelp = [...scripts]
          // @ts-expect-error: use private commander function.
          .filter((script: string) => !cli._findCommand(script))

        if (managerScriptHelp) {
          outputFormatter.newLine().title('scripts', {
            title: manager.toString(),
          })
          outputFormatter.log(
            chalk.reset('  ' + managerScriptHelp.join('\n  ')),
          )
        }
      })

      return ''
    })
}
