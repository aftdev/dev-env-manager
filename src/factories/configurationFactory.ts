import nconf, { Provider } from 'nconf'
// @ts-expect-error: nconf has not type def
import nconfYaml from 'nconf-yaml'
import Application from '#src/Application.js'
import defaultConfig from '#src/config.js'

/**
 * Generate the configuration nconf object.
 *
 * Each project can overrides the default configurations.
 * We will use the projectPath parameter in order to find that custom
 * configuration file.
 */
export default function (projectPath: string): Provider {
  const configuration = new nconf.Provider()

  configuration.use('memory')

  // Fetch Project Configuration.
  const projectConfs = [
    `${projectPath}/${Application.CONFIG_FILE_OVERRIDE}`,
    `${projectPath}/${Application.CONFIG_FILE}`,
  ]

  projectConfs.forEach((file, index) => {
    configuration.add(`project_${index}`, {
      type: `file`,
      file,
      format: nconfYaml,
    })
  })

  // Add Default Configs
  configuration.defaults(defaultConfig)

  return configuration
}
