import { fileURLToPath } from 'node:url'
import { dirname } from 'path'
import {
  InjectionMode,
  asValue,
  asClass,
  createContainer,
  AwilixContainer,
} from 'awilix'
import Application from '#src/Application'
import factories from '#src/factories'
import services from '#src/services'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Initialize an application DI container.
 */
export default async function (projectPath: string): Promise<AwilixContainer> {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

  // Manually register other services.
  container.register({
    // Allows any factories to use container
    container: asValue(container),
    projectPath: asValue(projectPath),
    rootPath: asValue(__dirname),
    application: asClass(Application).singleton(),
    ...services,
    ...factories,
  })

  return container
}
