import chalkTemplate from 'chalk-template'
import type { DevCommandInitializer } from '#src/types'

/**
 * Fallback command using commander event system.
 */
const initCommands: DevCommandInitializer = ({
  cli,
  environmentManager,
  packageManagerScripts,
  enquirer,
}) => {
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
        const choice = (await enquirer.prompt({
          type: 'select',
          name: 'manager',
          message: 'Select which package manager to use:',
          choices: managers.map((manager) => manager.constructor.name),
        })) as { manager: string }

        manager = managers.find(
          (manager) => manager.constructor.name === choice.manager,
        )
      } else {
        manager = managers.shift()
      }

      if (manager) {
        manager.executeScript(command, args)
        return
      }
    }

    // Use Env manager to execute the command.
    if (environmentManager.canExecuteCommand(command)) {
      environmentManager.executeCommand(command, args)
      return
    }

    // Error out.
    throw new Error(
      chalkTemplate`Invalid Command {white.dim (add --help for additional information)}`,
    )
  })
}

export default initCommands
