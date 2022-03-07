/**
 * AbstractEnvironment class.
 *
 * @abstract
 */
/* c8 ignore start */
export default class AbstractEnvironment {
  _commandExecuter

  constructor(commandExecuter) {
    this._commandExecuter = commandExecuter
  }

  /**
   * Is this environment enabled.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return false
  }

  /**
   * Execute command on the environment.
   */
  /* eslint-disable */
  execute(command = [], options = {}) {}

  /**
   * Execute command to setup the environment.
   */
  setup() {}

  /**
   * Start the environment.
   */
  start() {}

  /**
   * Stop the environment.
   */
  stop() {}

  /**
   * Display Environment status.
   */
  status() {}

  /**
   * Connect to the environment.
   */
  connect() {}
}
