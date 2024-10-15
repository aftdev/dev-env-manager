import type { DevCommandInitializer } from './index.js'
import AbstractEnvironment from '#services/Environment/AbstractEnvironment.js'

/**
 * Add commands to setup / start / stop / environments.
 */
const initCommands: DevCommandInitializer = ({
  cli,
  environmentManager,
  node,
  composer,
  outputFormatter,
  enquirer,
}) => {
  /**
   * Execute a function on enabled environments that match criteria.
   *
   * @param operation -
   * @param criteria -
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

  // @ts-expect-error: using private commander functions
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
      .action(async () => {
        // Environments
        outputFormatter.title('Build and start environments', {
          title: 'Setup',
        })
        executeOnEnabledEnvs('setup', { setup: true })

        if (composer.isEnabled()) {
          composer.execute(['install'])
        }

        // packages.json (npm / yarn / pnpm)
        if (node.isEnabled()) {
          node.execute(['install'])
        }
      })
  }
}

export default initCommands
