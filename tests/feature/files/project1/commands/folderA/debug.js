/**
 * Adding test commands.
 */
export default ({ cli, outputFormatter }) => {
  cli.command('debug_test').action(() => {
    outputFormatter.debug('Debug message')
  })
}
