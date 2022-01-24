import DockerCompose from '../services/DockerCompose.js'

/**
 * Factory to create Composer service.
 *
 * @returns {Composer}
 */
export default function (configuration, commandExecuter) {
  const configFile = configuration.get('docker-compose:config_file')

  return new DockerCompose(commandExecuter, configFile)
}
