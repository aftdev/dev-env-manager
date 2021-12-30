/**
 * Adding test commands.
 */
export default (cli, outputFormatter) => {
  cli.command('project1_command').action(() => {
    outputFormatter.output('Hello from Project 1')
  })
}
