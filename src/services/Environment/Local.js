import AbstractEnvironment from './AbstractEnvironment.js'

/**
 */
export default class Local extends AbstractEnvironment {
  isEnabled() {
    return true
  }

  /**
   * Execute a command locally.
   *
   * @param {Array} args
   */
  execute(args = []) {
    const command = args.shift()
    return this._commandExecuter.execute(command, args)
  }
}
