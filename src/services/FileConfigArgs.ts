import fs from 'fs'

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
