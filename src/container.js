import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Lifetime, InjectionMode, asValue, asClass, aliasTo, createContainer } from 'awilix'
import Application from './Application.js'

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

  // From service folder.
  await container.loadModules(['services/**/*.js'], opts)

  // Override each service if they have a factory.
  await container.loadModules(['factories/**/*.js'], {
    ...opts,
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
    formatName: (name) => name.replace('Factory', ''),
  })

  // Manually register other services.
  container.register({
    projectPath: asValue(projectPath),
    rootPath: asValue(__dirname),
    application: asClass(Application)
      .singleton()
      .inject((c) => ({ container: c })),
    config: aliasTo('configuration'),
  })

  return container
}
