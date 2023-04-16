/* eslint-disable @typescript-eslint/no-empty-function */
import AbstractEnvironment from './AbstractEnvironment.js'

/**
 */
export default class Local extends AbstractEnvironment {
  override isEnabled(): boolean {
    return true
  }

  /**
   * Execute a command locally.
   */
  override execute(args: Array<string> = []) {
    const command = args.shift()
    if (command) {
      return this.commandExecuter.execute(command, args)
    }
  }

  override setup(): void {}
  override start(): void {}
  override stop(): void {}
  override status(): void {}
  override connect(): void {}
}
