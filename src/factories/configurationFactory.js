import fs from 'fs'
import nconf from 'nconf'
import yaml from 'yaml'
import Application from '../Application.js'
import defaultConfig from '../config.js'

/**
 * Generate the configuration nconf object.
 *
 * Each project can overrides the default configurations.
 * We will use the projectPath parameter in order to find that custom
 * configuration file.
 *
 * @returns {nconf.Provider}
 */
export default function (projectPath) {
  const configuration = new nconf.Provider()

  configuration.use('memory')

  // Fetch Project Configuration
  const configurationFile = `${projectPath}/${Application.CONFIG_FILE}`
  if (fs.existsSync(configurationFile)) {
    const file = fs.readFileSync(configurationFile, 'utf8')
    const projectConf = yaml.parse(file)

    configuration.add('project', { type: 'literal', store: projectConf })
  }

  // Add Default Configs
  configuration.defaults(defaultConfig)

  return configuration
}
