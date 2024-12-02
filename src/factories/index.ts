import { asFunction } from 'awilix'
import cliFactory from '#src/factories/cliFactory'
import composerFactory from '#src/factories/composerFactory'
import configurationFactory from '#src/factories/configurationFactory'
import consolaFactory from '#src/factories/consolaFactory'
import enquirerFactory from '#src/factories/enquirerFactory'
import environmentManagerFactory from '#src/factories/environmentManagerFactory'
import nodeFactory from '#src/factories/nodeFactory'
import packageManagerScriptsFactory from '#src/factories/packageManagerScriptsFactory'

const factories = {
  cli: asFunction(cliFactory).singleton(),
  composer: asFunction(composerFactory).singleton(),
  configuration: asFunction(configurationFactory).singleton(),
  consola: asFunction(consolaFactory).singleton(),
  enquirer: asFunction(enquirerFactory).singleton(),
  node: asFunction(nodeFactory).singleton(),
  packageManagerScripts: asFunction(packageManagerScriptsFactory).singleton(),
  environmentManager: asFunction(environmentManagerFactory).singleton(),
}

export default factories
