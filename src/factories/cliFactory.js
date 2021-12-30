import chalk from 'chalk'
import commander from 'commander'
/**.
 * Create and configure the main "commander" cli
 *
 * @returns {Command}
 */
export default function (configuration, packageManagerScripts) {
  return new commander.Command('dev')
    .description(configuration.name)
    .enablePositionalOptions()
    .passThroughOptions()
    .showSuggestionAfterError()
    .configureHelp({
      sortOptions: true,
      sortSubcommands: true,
    })
    .addHelpText('after', () => {
      const scripts = packageManagerScripts.getScripts()
      let help = ''
      if (scripts.length > 0) {
        help = chalk.cyan('\nPackage manager commands:')
        help += chalk.grey('\nCommands found in package manager configuration files')
        for (const s in scripts) {
          help += `\n  ${scripts[s]}`
        }
      }
      return help
    })
}
