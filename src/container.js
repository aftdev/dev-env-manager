import { dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  Lifetime,
  InjectionMode,
  asValue,
  asClass,
  createContainer,
} from 'awilix'
import Application from './Application.js'
import OutputFormatter from './services/OutputFormatter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Initialize an application DI container.
 *
 * @param {string} projectPath
 * @returns {AwilixContainer}
 */
export default async function (projectPath) {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

  // Automatically register our service.
  const opts = {
    esModules: true,
    cwd: __dirname,
    formatName: 'camelCase',
  }

  // Automatically register services
  // - from service folder
  await container.loadModules(['services/**/*.js'], opts)

  // - from factories (will override above)
  await container.loadModules(['factories/**/*.js'], {
    ...opts,
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
    formatName: (name) => name.replace('Factory', ''),
  })

  // Manually register other services.
  container.register({
    // Allows any factories to use container
    container: asValue(container),
    projectPath: asValue(projectPath),
    rootPath: asValue(__dirname),
    application: asClass(Application).singleton(),
    outputFormatter: asClass(OutputFormatter),
  })

  return container
}
