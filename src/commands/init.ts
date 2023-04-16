import fs from 'fs'
import type { Command } from 'commander'
import type Enquirer from 'enquirer'
import yaml from 'yaml'
import type OutputFormatter from '#services/OutputFormatter.js'
import Application from '#src/Application.js'

/**
 * Initialization related commands.
 */
export default (
  cli: Command,
  outputFormatter: OutputFormatter,
  enquirer: Enquirer,
) => {
  cli
    .command('init')
    .enablePositionalOptions()
    .description(`Create ${Application.CONFIG_FILE} file for your project`)
    .action(async () => {
      const configFilePath = `./${Application.CONFIG_FILE}`

      if (fs.existsSync(configFilePath)) {
        throw new Error('Config file already exists')
      }

      // Prompt.
      const choice = (await enquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        initial: true,
        message: `This will create the file in the current directory ${process.cwd()}`,
      })) as { confirm: boolean }

      if (!choice.confirm) {
        return
      }

      // Create config file.
      const config = {
        name: 'Application Name',
        commands_dirs: { default: './commands' },
      }

      const yamlStr = `# Documentation: https://github.com/aftdev/dev-env-manager#configuration \n${yaml.stringify(
        config,
      )}`

      fs.writeFileSync(configFilePath, yamlStr)

      outputFormatter.success(`${Application.CONFIG_FILE} file created`)
    })
}
