import fs from 'fs'
import yaml from 'yaml'
import type { DevCommandInitializer } from '#src/types'

/**
 * Initialization related commands.
 */
const initCommands: DevCommandInitializer = ({
  cli,
  outputFormatter,
  enquirer,
  application,
}) => {
  const configFile = application.configFiles().at(-1)

  cli
    .command('init')
    .enablePositionalOptions()
    .description(`Create ${configFile} file for your project`)
    .action(async () => {
      const configFilePath = `./${configFile}`

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

      outputFormatter.success(`${configFile} file created`)
    })
}

export default initCommands
