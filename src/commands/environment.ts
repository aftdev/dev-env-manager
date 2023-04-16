import type { Command } from 'commander'
import type Enquirer from 'enquirer'
import AbstractEnvironment from '#services/Environment/AbstractEnvironment.js'
import EnvironmentManager from '#services/EnvironmentManager.js'
import type OutputFormatter from '#services/OutputFormatter.js'
import type AbstractPackageManager from '#services/PackageManager/AbstractPackageManager.js'
import type Composer from '#services/PackageManager/Composer.js'

/**
 * Add commands to setup / start / stop / environments.
 */
export default (
  cli: Command,
  outputFormatter: OutputFormatter,
  environmentManager: EnvironmentManager,
  node: AbstractPackageManager,
  composer: Composer,
  enquirer: Enquirer,
) => {
  /**
   * Execute a function on enabled environments that match criteria.
   *
   * @param {string} operation
   * @param {object} criteria
   */
  const executeOnEnabledEnvs = (
    operation: 'start' | 'stop' | 'status' | 'setup',
    criteria = {},
  ) => {
    const envs = environmentManager.groupedBy(criteria)
    envs.forEach((env) => {
      if (env.isEnabled()) {
        env[operation]()
      }
    })
  }

  // @ts-expect-error: using private commander functions
  if (!cli._findCommand('start')) {
    cli
      .command('start')
      .alias('up')
      .description('Start project environment')
      .action(() => {
        executeOnEnabledEnvs('start', { start: true })
      })
  }

  /// @ts-expect-error: using private commander functions
  if (!cli._findCommand('stop')) {
    cli
      .command('stop')
      .alias('down')
      .description('Stop project environment')
      .action(() => {
        executeOnEnabledEnvs('stop', { start: true })
      })
  }

  // @ts-expect-error: using private commander functions
  if (!cli._findCommand('ssh')) {
    cli
      .command('ssh [target]')
      .alias('connect')
      .option('-r, --root', 'Connect as ROOT')
      .description('Connect to one of environment')
      .action(async (target, options) => {
        // Fetch all Targets.
        const envs = environmentManager.groupedBy({ connect: true })
        const targets: [string, AbstractEnvironment][] = []

        envs.forEach((env) => {
          // @ts-expect-error: env is abstract
          if (typeof env.getTargets === 'function') {
            // @ts-expect-error: env is abstract
            const envTargets = env.getTargets()
            envTargets.forEach((target: string) => {
              targets.push([target, env])
            })
          }
        })

        const targetMap = new Map(targets)
        if (!targetMap.size) {
          throw new Error('No targets found')
        }

        if (!target) {
          // If only one target, just use it without asking.
          if (targetMap.size === 1) {
            ;[target] = targetMap.keys()
          } else {
            const choice = (await enquirer.prompt({
              type: 'select',
              name: 'target',
              message: 'Select a target to connect to:',
              choices: [...targetMap.keys()],
            })) as { target: string }

            target = choice.target
          }
        }

        if (!targetMap.has(target)) {
          throw new Error('Invalid target')
        }

        const env = targetMap.get(target)
        options.target = target
        env!.connect(options)
      })
  }

  // @ts-expect-error: using private commander functions
  if (!cli._findCommand('status')) {
    cli
      .command('status')
      .description('Display status information about the environments')
      .action(() => {
        executeOnEnabledEnvs('status', { start: true })
      })
  }

  // @ts-expect-error: using private commander functions
  if (!cli._findCommand('setup')) {
    cli
      .command('setup')
      .description('Initial setup')
      .action(() => {
        // Environments
        outputFormatter.newLine().subtitle('Build and start environments')
        executeOnEnabledEnvs('setup', { setup: true })

        // Package Managers
        // Composer
        if (composer.isEnabled()) {
          outputFormatter.newLine().subtitle('Composer')
          composer.execute(['install'])
        }

        // packages.json (npm / yarn / pnpm)
        if (node.isEnabled()) {
          outputFormatter.newLine().subtitle('\nNode')
          node.execute(['install'])
        }
      })
  }
}
