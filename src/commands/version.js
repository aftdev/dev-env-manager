import fs from 'fs'
import chalk from 'chalk'

/**
 * Display version information.
 */
export default (cli, outputFormatter, rootPath) => {
  cli
    .option('-V, --version', 'Output the current version')
    .on('option:version', () => {
      const { version } = JSON.parse(
        fs.readFileSync(`${rootPath}/../package.json`, 'utf8'),
      )

      outputFormatter.output(chalk`Version: {green ${version}}`)

      return cli._exit(0, 'commander.version', version)
    })
}
