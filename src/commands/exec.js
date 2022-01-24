import inquirer from 'inquirer'

/**
 * Fallback command using commander event system.
 */
export default (cli, commandExecuter, dockerCompose, packageManagerScripts) => {
  // Fallback for any commands.
  cli.on('command:*', async (calledCommand) => {
    const command = calledCommand[0]
    const args = calledCommand.slice(1)

    // Try to execute script from package managers.
    if (packageManagerScripts.hasScript(command)) {
      const managers = packageManagerScripts.getManagersForScript(command)
      let manager
      if (managers.length > 1) {
        const choice = await inquirer.prompt({
          type: 'list',
          name: 'manager',
          message: 'Select which package manager to use:',
          choices: managers.map((manager) => manager.constructor.name),
        })

        manager = managers.find(
          (manager) => manager.constructor.name === choice.manager,
        )
      } else {
        manager = managers.shift()
      }

      return manager.executeScript(command, args)
    }

    // Else - Lets check if docker has a container that match
    // the command.
    // If it does execute the rest of command on that container.
    if (dockerCompose.isEnabled() && dockerCompose.hasContainer(command)) {
      dockerCompose.containerExecute(command, args)
      return
    }

    // Fallback
    return commandExecuter.execute(command, args)
  })
}
