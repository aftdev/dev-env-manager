import fs from 'fs'
import yaml from 'yaml'
import Application from '../Application.js'
import defaultConfig from '../config.js'

/**
 * Generate the configuration object.
 *
 * Each project can overrides the default configurations.
 * We will use the projectPath parameter in order to find that custom
 * configuration file.
 */
export default function (projectPath) {
  const configurationFile = `${projectPath}/${Application.CONFIG_FILE}`
  let configuration = {}
  if (fs.existsSync(configurationFile)) {
    const file = fs.readFileSync(configurationFile, 'utf8')
    configuration = yaml.parse(file)
  }

  // Object Freeze?
  return { ...defaultConfig, ...configuration }
}
