import fs from 'fs'
import inquirer from 'inquirer'
import yaml from 'yaml'
import Application from '../Application.js'

/**
 * Initialization related commands.
 */
export default (cli, outputFormatter, commandExecuter) => {
  // Create the dev-config.yml file at the root of the project running the command.
  cli
    .command('init')
    .enablePositionalOptions()
    .description(`Create ${Application.CONFIG_FILE} file for your project`)
    .action(async () => {
      outputFormatter.title('Initialize Project')
      const configFilePath = `./${Application.CONFIG_FILE}`

      if (fs.existsSync(configFilePath)) {
        return commandExecuter.exitScriptWithError('Config file already exists')
      }

      // Prompt.
      const choice = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `This will create the file in the current directory ${process.cwd()}`,
      })

      if (!choice.confirm) {
        return
      }

      // Create config file.
      const config = {
        name: 'Name',
        commands_dir: './commands',
        autodiscover: {
          'package.json': 'npm',
          'composer.json': 'composer',
        },
        executables: {
          'docker-compose': 'docker compose',
          npm: 'yarn',
          composer: 'composer',
        },
      }

      let yamlStr = yaml.stringify(config)

      fs.writeFileSync(configFilePath, yamlStr)

      outputFormatter.success(`${Application.CONFIG_FILE} file created`)
    })
}
