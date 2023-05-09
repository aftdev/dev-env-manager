import type { AwilixContainer } from 'awilix'
import type { Command } from 'commander'
import type Enquirer from 'enquirer'
import type { Provider as Nconf } from 'nconf'
import type EnvironmentManager from '#services/EnvironmentManager.js'
import type OutputFormatter from '#services/OutputFormatter.js'
import type Composer from '#services/PackageManager/Composer.js'
import type Npm from '#services/PackageManager/Npm.js'
import type PackageManagerScript from '#services/PackageManagerScript.js'

/**
 * List all our services that can be used by the command initializers
 */
export type RegisteredServices = {
  /**
   * The current project configuration store.
   *
   * @see https://github.com/indexzero/nconf
   */
  configuration: Nconf
  /**
   * The Commander Application
   *
   * This is where you want to register your commands
   *
   * @see https://github.com/tj/commander.js#commands
   */
  cli: Command
  /**
   * Helper class to output messages
   */
  outputFormatter: OutputFormatter
  /**
   * Manager to fetch all your envs from
   */
  environmentManager: EnvironmentManager
  /**
   * Node class to execute npm/pnpm or yarn commands
   */
  node: Npm
  /**
   * Composer class to execute composer scripts
   */
  composer: Composer
  /**
   * Create cli prompts with Enquirer.
   *
   * @see https://github.com/enquirer/enquirer
   */
  enquirer: Enquirer
  /**
   * Create cli prompts with inquirer.
   *
   * @see https://github.com/inquirerjs/inquirer
   */
  packageManagerScripts: PackageManagerScript
  /**
   * The service container
   *
   * You should probably not have to interact with directly :)
   */
  container: AwilixContainer
  /**
   * The root path of dev-env-manager
   */
  rootPath: string
  /**
   * The path of the current project (where the executable was called from)
   */
  projectPath: string
}
