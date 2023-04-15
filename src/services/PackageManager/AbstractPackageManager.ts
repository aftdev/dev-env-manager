import fs from 'fs'
import EnvironmentManager from '../EnvironmentManager.js'
import FileConfigArgs from '../FileConfigArgs.js'
import type { CommandArgs } from '#services/CommandExecuter.js'

/**
 * AbstractPackageManager class.
 */
export default abstract class AbstractPackageManager {
  protected abstract command: string
  protected abstract defaultConfigFile: string
  protected abstract configArg?: string

  protected scripts?: Array<string>
  private fileConfigArgsService?: FileConfigArgs

  /**
   * Create class and configure it properly.
   */
  constructor(
    protected environmentManager: EnvironmentManager,
    protected configFiles: Array<string> = [],
  ) {}

  public isEnabled(): boolean {
    return this.fileConfigArgs().configFilesExists()
  }

  /**
   * Execute a command for this service.
   */
  public execute(args: CommandArgs) {
    const finalArgs = [...this.fileConfigArgs().getConfigArguments(), ...args]

    return this.environmentManager.executeCommand(this.command, finalArgs)
  }

  /**
   * Install / download all packages.
   */
  public install() {
    this.execute(['install'])
  }

  /**
   * Execute Script.
   */
  public executeScript(script: string, args: CommandArgs = []) {
    args = [script, ...args]

    return this.execute(args)
  }

  /**
   * Return true if this manager can handle the script.
   */
  public hasScript(script: string): boolean {
    return this.getScripts().includes(script)
  }

  /**
   * Return all scripts that are available for this manager.
   *
   * Note: only works with json config file for now.
   */
  public getScripts() {
    if (undefined === this.scripts) {
      this.scripts = []
      this.fileConfigArgs().configFiles.forEach((filePath: string) => {
        const jsonValue = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        for (const script in jsonValue?.scripts) {
          this.scripts?.push(script)
        }
      })
    }

    return this.scripts
  }

  protected fileConfigArgs(): FileConfigArgs {
    this.fileConfigArgsService ??= new FileConfigArgs(
      this.configFiles,
      this.defaultConfigFile,
      this.configArg,
    )

    return this.fileConfigArgsService
  }
}
