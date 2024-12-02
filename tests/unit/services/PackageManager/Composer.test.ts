import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox } from 'sinon'
import EnvManager from '#src/services/EnvironmentManager'
import Composer from '#src/services/PackageManager/Composer'

describe('Composer unit tests', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`executes commands properly`, () => {
    const envManagerStub = sandbox.createStubInstance(EnvManager)
    const composer = new Composer(envManagerStub)
    composer.execute(['test command'])

    expect(
      envManagerStub.executeCommand.withArgs('composer', ['test command'])
        .callCount,
    ).to.be.eq(1)
  })

  it('should properly execute install process', () => {
    const envManagerStub = sandbox.createStubInstance(EnvManager)
    const packageManager = new Composer(envManagerStub)
    packageManager.install()

    expect(
      envManagerStub.executeCommand.withArgs('composer', ['install']).callCount,
    ).to.be.eq(1)
  })
})
