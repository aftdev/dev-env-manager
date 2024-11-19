import { Command } from 'commander'
import { ConsolaInstance } from 'consola'
import type { Provider } from 'nconf'
import type PackageManagerScript from '#services/PackageManagerScript.js'

/**
 * Create and configure the main "commander" cli.
 */
export default function (
  configuration: Provider,
  packageManagerScripts: PackageManagerScript,
  consola: ConsolaInstance,
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
      let help = ''
      allScripts.forEach((scripts, manager) => {
        if (scripts.size == 0) {
          return
        }
        let managerScriptHelp = ''
        scripts.forEach((script) => {
          // Do not show commands defined on the cli object has they won't
          // be able to be executed.
          // @ts-expect-error: use private commander function.
          if (!cli._findCommand(script)) {
            managerScriptHelp += `\n  ${script}`
          }
        })

        if (managerScriptHelp) {
          help += `\n${manager} commands: ${managerScriptHelp}\n`
        }
      })

      return help
    })
}
