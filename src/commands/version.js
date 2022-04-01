import fs from 'fs'
import chalkTemplate from 'chalk-template'

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

      outputFormatter.output(chalkTemplate`Version: {green ${version}}`)

      return cli._exit(0, 'commander.version', version)
    })
}
