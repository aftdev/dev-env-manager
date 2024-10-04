import CommandExecuter from '#services/CommandExecuter.js'

export type EnvironmentOptions = object

/**
 * AbstractEnvironment class.
 */
/* c8 ignore start */
export default abstract class AbstractEnvironment {
  constructor(protected commandExecuter: CommandExecuter) {}

  /**
   * Is this environment enabled.
   */
  isEnabled(): boolean {
    return false
  }

  /**
   * Execute command on the environment.
   */
  abstract execute(command: unknown, options: unknown): unknown

  /**
   * Execute command to setup the environment.
   */
  abstract setup(): void

  /**
   * Start the environment.
   */
  abstract start(): void

  /**
   * Stop the environment.
   */
  abstract stop(): void

  /**
   * Display Environment status.
   */
  abstract status(): void

  /**
   * Connect to the environment.
   */
  abstract connect(options: unknown): void
}
