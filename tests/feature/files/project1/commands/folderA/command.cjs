/**
 * Adding Common js test commands.
 */
const commands = ({ cli, outputFormatter }) => {
  cli.command('project1_command_cjs').action(() => {
    outputFormatter.log('Hello from Project 1 - folder A - CJS')
  })
}

module.exports = commands
