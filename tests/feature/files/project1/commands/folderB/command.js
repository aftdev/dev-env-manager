/**
 * Adding test commands.
 */
export default ({ cli, outputFormatter }) => {
  cli.command('project1_command_b').action(() => {
    outputFormatter.output('Hello from Project 1 - folder B')
  })
}
