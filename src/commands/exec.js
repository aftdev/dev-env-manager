/**
 * Fallback command using commander event system.
 */
export default (cli, commandExecuter, dockerCompose, packageManagerScripts) => {
  // Fallback for any commands.
  cli.on('command:*', (calledCommand) => {
    const command = calledCommand[0]
    const args = calledCommand.slice(1)

    // Try to execute script from package managers.
    if (packageManagerScripts.hasScript(command)) {
      packageManagerScripts.executeScript(command, args)
      return
    }

    // Else - Lets check if docker has a container that match
    // the command.
    // If it does execute the rest of command on that container.
    if (dockerCompose.hasContainer(command)) {
      dockerCompose.containerExecute(command, args)
      return
    }

    // Fallback
    return commandExecuter.execute(command, args)
  })
}
