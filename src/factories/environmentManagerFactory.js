import EnvironmentManager from '#services/EnvironmentManager'

/**
 * Factory to create and return environment manager.
 */
export default function (container, configuration) {
  const config = configuration.get(`environments`)

  return new EnvironmentManager(container, config)
}
