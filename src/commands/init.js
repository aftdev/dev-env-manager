import fs from 'fs'
import inquirer from 'inquirer'
import yaml from 'yaml'
import Application from '#src/Application'

/**
 * Initialization related commands.
 */
export default (cli, outputFormatter) => {
  cli
    .command('init')
    .enablePositionalOptions()
    .description(`Create ${Application.CONFIG_FILE} file for your project`)
    .action(async () => {
      const configFilePath = `./${Application.CONFIG_FILE}`

      if (fs.existsSync(configFilePath)) {
        throw 'Config file already exists'
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
        name: 'Application Name',
        commands_dirs: { default: './commands' },
      }

      let yamlStr = `# Documentation: https://github.com/aftdev/dev-env-manager#configuration \n${yaml.stringify(
        config,
      )}`

      fs.writeFileSync(configFilePath, yamlStr)

      outputFormatter.success(`${Application.CONFIG_FILE} file created`)
    })
}
