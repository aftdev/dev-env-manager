import inquirer from 'inquirer'

/**
 * Add commands to setup / start / stop / environments.
 */
export default (cli, outputFormatter, environmentManager, node, composer) => {
  /**
   * Execute a function on enabled environments that match criteria.
   *
   * @param {string} operation
   * @param {object} criteria
   */
  const executeOnEnabledEnvs = (operation, criteria = {}) => {
    const envs = environmentManager.groupedBy(criteria)
    envs.forEach((env) => {
      if (env.isEnabled()) {
        env[operation]()
      }
    })
  }

  if (!cli._findCommand('start')) {
    cli
      .command('start')
      .alias('up')
      .description('Start project environment')
      .action(() => {
        executeOnEnabledEnvs('start', { start: true })
      })
  }

  if (!cli._findCommand('stop')) {
    cli
      .command('stop')
      .alias('down')
      .description('Stop project environment')
      .action(() => {
        executeOnEnabledEnvs('stop', { start: true })
      })
  }

  if (!cli._findCommand('ssh')) {
    cli
      .command('ssh [target]')
      .alias('connect')
      .option('-r, --root', 'Connect as ROOT')
      .description('Connect to one of environment')
      .action(async (target, options) => {
        // Fetch all Targets.
        const envs = environmentManager.groupedBy({ connect: true })
        const targets = []

        envs.forEach((env) => {
          if (typeof env.getTargets === 'function') {
            const envTargets = env.getTargets()
            envTargets.forEach((target) => {
              targets.push([target, env])
            })
          }
        })

        const targetMap = new Map(targets)
        if (!targetMap.size) {
          throw 'No targets found'
        }

        if (!target) {
          // If only one target, just use it without asking.
          if (targetMap.size === 1) {
            ;[target] = targetMap.keys()
          } else {
            const choice = await inquirer.prompt({
              type: 'list',
              name: 'target',
              message: 'Select a target to connect to:',
              choices: [...targetMap.keys()],
            })
            target = choice.target
          }
        }

        if (!targetMap.has(target)) {
          throw 'Invalid target'
        }

        const env = targetMap.get(target)
        options.target = target
        env.connect(options)
      })
  }

  if (!cli._findCommand('status')) {
    cli
      .command('status')
      .description('Display status information about the environments')
      .action(() => {
        executeOnEnabledEnvs('status', { start: true })
      })
  }

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
