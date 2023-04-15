import fs from 'fs'
import chalkTemplate from 'chalk-template'
import type { Command } from 'commander'
import type OutputFormatter from '#services/OutputFormatter.js'

/**
 * Display version information.
 */
export default (
  cli: Command,
  outputFormatter: OutputFormatter,
  rootPath: string,
) => {
  cli
    .option('-V, --version', 'Output the current version')
    .on('option:version', () => {
      const { version } = JSON.parse(
        fs.readFileSync(`${rootPath}/../package.json`, 'utf8'),
      )

      outputFormatter.output(chalkTemplate`Version: {green ${version}}`)

      // @ts-expect-error: calling commander private functions :|
      return cli._exit(0, 'commander.version', version)
    })
}
