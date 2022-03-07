import { dirname } from 'path'
import process from 'process'
import findup from 'findup-sync'
import Application from './Application.js'
import createContainer from './container.js'

export default async function () {
  // Get closest dir that have the config file.
  let path = process.cwd()
  const configPath = findup(Application.CONFIG_FILE)
  if (configPath) {
    path = dirname(configPath)
  }

  // Initialize the container.
  const container = await createContainer(path)

  // Fetch and bootstrap the application.
  const application = container.resolve('application')
  await application.bootstrap()

  // Run Application.
  const [, , ...args] = process.argv

  return await application.run(args)
}
