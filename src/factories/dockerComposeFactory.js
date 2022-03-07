/**
 * Factory to create DockerCompose environment.
 *
 * @returns {DockerCompose}
 */
export default function (environmentManager) {
  return environmentManager.get('docker-compose')
}
