import chalkTemplate from 'chalk-template'
import type { Command } from 'commander'
import Enquirer from 'enquirer'
import type EnvironmentManager from '#services/EnvironmentManager.js'
import type PackageManagerScript from '#services/PackageManagerScript.js'

/**
 * Fallback command using commander event system.
 */
export default (
  cli: Command,
  environmentManager: EnvironmentManager,
  packageManagerScripts: PackageManagerScript,
  enquirer: Enquirer,
) => {
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
        //{manager: string}
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
