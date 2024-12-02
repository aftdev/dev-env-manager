import { dirname } from 'path'
import process from 'process'
import findup from 'findup-sync'
import Application from '#src/Application'
import createContainer from '#src/container'

export * from '#src/types'

export default async function () {
  // Get the closest dir that have the config file.
  let path = process.cwd()
  const configPath = findup(Application.CONFIG_FILE)
  if (configPath) {
    path = dirname(configPath)
  }

  // Initialize the container.
  const container = await createContainer(path)

  // Fetch and bootstrap the application.
  const application = container.resolve('application')
  const bootstrapped = await application.bootstrap()

  // If we could not bootstrap the application we return exit code 1
  if (!bootstrapped) {
    return 1
  }

  // Run Application.
  const [, , ...args] = process.argv

  return await application.run(args)
}
