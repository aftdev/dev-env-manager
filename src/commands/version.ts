import fs from 'fs'
import chalkTemplate from 'chalk-template'
import type { DevCommandInitializer } from './index.js'

/**
 * Display version information.
 */
const initCommands: DevCommandInitializer = ({
  cli,
  outputFormatter,
  rootPath,
}) => {
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

export default initCommands
