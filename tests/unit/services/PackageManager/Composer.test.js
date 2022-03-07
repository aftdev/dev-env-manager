import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import EnvManager from '../../../../src/services/EnvironmentManager.js'
import Composer from '../../../../src/services/PackageManager/Composer.js'

describe('Composer unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`execute commands properly`, () => {
    const envManagerStub = sandbox.createStubInstance(EnvManager)
    const composer = new Composer(envManagerStub)
    composer.execute(['test command'])

    expect(
      envManagerStub.executeCommand.withArgs(Composer.COMMAND, ['test command'])
        .callCount,
    ).to.be.eq(1)
  })
})
