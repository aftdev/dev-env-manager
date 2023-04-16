import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import nodeFactory from '../../../src/factories/nodeFactory.js'
import Npm from '../../../src/services/PackageManager/Npm.js'
import Pnpm from '../../../src/services/PackageManager/Pnpm.js'
import Yarn from '../../../src/services/PackageManager/Yarn.js'
import { default as createTestContainer } from '../testHelpers.js'

describe('Node Manager feature tests', () => {
  let container: AwilixContainer

  it('should pick right manager', async () => {
    container = await createTestContainer('project1')
    const configuration = container.resolve('configuration')

    const scenarios = [
      ['npm', Npm],
      ['yarn', Yarn],
      ['pnpm', Pnpm],
      ['invalid', Npm],
      [null, Npm],
    ]

    scenarios.forEach(([confValue, expected]) => {
      configuration.set('package_managers:node:manager', confValue)

      const nodeManager = container.build(nodeFactory)
      expect(nodeManager).to.be.instanceOf(expected)
    })
  })
})
