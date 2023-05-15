import fs from 'fs'
import type { CommandArgs } from './CommandExecuter.js'

export default class FileConfigArgs {
  public configFiles: Array<string> = []

  constructor(
    configFiles: string | Array<string> = [],
    private defaultConfigFile?: string,
    private configArg: string = '--file',
  ) {
    this.setConfigFiles(configFiles)
  }

  /**
   * Return true if all configuration files are present.
   */
  public configFilesExists(): boolean {
    return this.configFiles.every((file) => fs.existsSync(file))
  }

  /**
   * Return array of arguments needed to use the defined config files.
   */
  public getConfigArguments(): Array<{ [key: string]: Array<string> }> {
    // Do we need to use an arg to target the config file ?
    if (
      this.configFiles.length == 1 &&
      this.configFiles[0] == this.defaultConfigFile
    ) {
      return []
    }
    return this.buildConfigArguments()
  }

  /**
   * Inject config files as arguments.
   */
  public injectServiceConfig(args: CommandArgs): CommandArgs {
    return [...this.getConfigArguments(), ...args].filter((n) => n)
  }

  /**
   * Set the configuration files needed by the service.
   */
  private setConfigFiles(configFiles: string | Array<string> = []) {
    // Decide what config file to use.
    if (typeof configFiles == 'string') {
      configFiles = [configFiles]
    }

    if (configFiles.length > 0) {
      this.configFiles = configFiles
    } else if (this.defaultConfigFile) {
      this.configFiles = [this.defaultConfigFile]
    }
  }

  /**
   * Return array of arguments needed to use the defined config files.
   */
  private buildConfigArguments(): Array<{ [key: string]: Array<string> }> {
    return [{ [this.configArg]: this.configFiles }]
  }
}
