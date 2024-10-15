import { fileURLToPath } from 'node:url'
import { dirname } from 'path'
import {
  Lifetime,
  InjectionMode,
  asValue,
  asClass,
  createContainer,
  AwilixContainer,
} from 'awilix'
import type { LoadModulesOptions } from 'awilix/lib/load-modules.js'
import Application from './Application.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Initialize an application DI container.
 */
export default async function (projectPath: string): Promise<AwilixContainer> {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

  // Automatically register our service.
  const opts: LoadModulesOptions<true> = {
    esModules: true,
    cwd: __dirname,
    formatName: 'camelCase',
  }

  // Automatically register services
  // - from service folder
  await container.loadModules<true>(['services/**/!(*.d).{js,ts}'], opts)

  // - from factories (will override above)
  await container.loadModules(['factories/**/!(*.d).{js,ts}'], {
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
  })

  return container
}
