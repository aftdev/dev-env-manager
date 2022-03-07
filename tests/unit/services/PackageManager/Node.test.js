import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import EnvManager from '../../../../src/services/EnvironmentManager.js'
import Npm from '../../../../src/services/PackageManager/Npm.js'
import Pnpm from '../../../../src/services/PackageManager/Pnpm.js'
import Yarn from '../../../../src/services/PackageManager/Yarn.js'

describe('Node Package Managers unit tests', () => {
  let sandbox, envManagerStub
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    envManagerStub = sandbox.createStubInstance(EnvManager)
  })

  afterEach(() => {
    sandbox.restore()
  })

  const managers = [
    ['npm', Npm],
    ['pnpm', Pnpm],
    ['yarn', Yarn],
  ]

  managers.forEach(([name, manager]) => {
    it(`execute ${name} commands properly`, () => {
      const packageManager = new manager(envManagerStub)
      packageManager.execute(['test command'])

      expect(
        envManagerStub.executeCommand.withArgs(manager.COMMAND, [
          'test command',
        ]).callCount,
      ).to.be.eq(1)
    })

    it(`should execute ${name} script`, () => {
      const packageManager = new manager(envManagerStub)
      packageManager.executeScript('script')

      expect(
        envManagerStub.executeCommand.withArgs(manager.COMMAND, [
          'run',
          'script',
        ]).callCount,
      ).to.be.eq(1)
    })
  })
})
