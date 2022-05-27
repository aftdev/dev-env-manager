import chalkTemplate from 'chalk-template'

/**
 * Fallback command using commander event system.
 */
export default (cli, environmentManager, packageManagerScripts, enquirer) => {
  // Fallback for any commands.
  cli.action(async () => {
    const allArgs = cli.args

    const command = allArgs[0]
    const args = allArgs.slice(1)

    // Try to execute script from package managers.
    if (packageManagerScripts.hasScript(command)) {
      const managers = packageManagerScripts.getManagersForScript(command)
      let manager
      if (managers.length > 1) {
        const choice = await enquirer.prompt({
          type: 'select',
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

    // Use Env manager to execute the command.
    if (environmentManager.canExecuteCommand(command)) {
      return environmentManager.executeCommand(command, args)
    }

    // Error out.
    throw chalkTemplate`Invalid Command {white.dim (add --help for additional information)}`
  })
}
