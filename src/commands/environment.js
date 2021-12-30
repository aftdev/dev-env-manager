import inquirer from 'inquirer'

/**
 * Add commands to start / stop / environment
 * Only compatible with docker for now.
 */
export default (cli, commandExecuter, outputFormatter, dockerCompose) => {
  if (!cli._findCommand('start')) {
    cli
      .command('start')
      .alias('up')
      .description('Start project environment')
      .action(() => {
        dockerCompose.execute(['up', '-d'])
      })
  }

  if (!cli._findCommand('stop')) {
    cli
      .command('stop')
      .alias('down')
      .description('Stop project environment')
      .action(() => {
        dockerCompose.execute(['down'])
      })
  }

  if (!cli._findCommand('ssh')) {
    cli
      .command('ssh [container]')
      .alias('connect')
      .option('-r, --root', 'Connect as ROOT')
      .description('Connect to one of the docker service')
      .action(async (container, options) => {
        outputFormatter.title('Connect to a container')

        if (!container) {
          const containers = dockerCompose.getContainers()
          if (containers.length === 0) {
            return commandExecuter.exitScriptWithError('No running containers')
          }

          const choice = await inquirer.prompt({
            type: 'list',
            name: 'container',
            message: 'Select container to connect to',
            choices: containers,
          })

          container = choice.container
        }
        dockerCompose.containerExecute(container, ['bash'], options.root)
      })
  }

  if (!cli._findCommand('status')) {
    cli
      .command('status')
      .description('Display status information')
      .action(() => {
        outputFormatter.title('Status')

        dockerCompose.execute(['ps'])
      })
  }
}
