import fs from 'fs'
import type { DevCommandInitializer } from '#src/types'

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
      outputFormatter.debug(process.version, 'Node version')

      const { version } = JSON.parse(
        fs.readFileSync(`${rootPath}/../package.json`, 'utf8'),
      )
      outputFormatter.success(version, 'Version')

      // eslint-disable-next-line n/no-process-exit
      process.exit(0)
    })
}

export default initCommands
