import type { AwilixContainer } from 'awilix'
import type { Provider } from 'nconf'
import EnvironmentManager from '#services/EnvironmentManager.js'

/**
 * Factory to create and return environment manager.
 */
export default function (container: AwilixContainer, configuration: Provider) {
  const config = configuration.get(`environments`)

  return new EnvironmentManager(container, config)
}
