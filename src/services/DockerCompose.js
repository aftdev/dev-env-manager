import { RESOLVER, Lifetime } from 'awilix'
import AbstractFilebasedService from './AbstractFilebasedService.js'

/**
 * Docker composer goodies.
 */
export default class DockerCompose extends AbstractFilebasedService {
  static FILE = 'docker-compose.yml'
  static COMMAND = 'docker-compose'

  #containers

  /**
   * Get list of containers.
   *
   * @returns { Array }
   */
  getContainers() {
    if (this.#containers != undefined) {
      return this.#containers
    }

    this.#containers = []

    if (this.isEnabled()) {
      const services = this._commandExecuter.backgroundExecute(DockerCompose.COMMAND, [
        'ps',
        '--services',
      ])

      this.#containers = services
        .toString()
        .trim()
        .split('\n')
        .filter((n) => n)
    }

    return this.#containers
  }

  /**
   * Returns true if a container exists.
   *
   * @param {string} container
   * @returns {boolean}
   */
  hasContainer(container) {
    const containers = this.getContainers()

    return containers.indexOf(container) !== -1
  }

  /**
   * Execute a command on the given container.
   *
   * @param {string} container
   * @param {Array} command
   * @param {boolean} root
   * @returns
   */
  containerExecute(container, command = [], root = false) {
    const rootParam = root ? '-u=root' : ''
    const args = ['exec', rootParam, container].filter((n) => n)

    return this.execute([...args, ...command])
  }
}

// DI info
DockerCompose[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
