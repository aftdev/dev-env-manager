/**
 * Adding test commands.
 */
export default ({ cli, outputFormatter }) => {
  cli.command('project1_command_a').action(() => {
    outputFormatter.log('Hello from Project 1 - folder A')
  })
}
