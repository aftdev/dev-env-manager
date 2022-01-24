import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../../src/services/CommandExecuter.js'
import Npm from '../../../../src/services/PackageManager/Npm.js'

describe('Npm unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`execute commands properly`, () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const npm = new Npm(commandExecuterStub)
    npm.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(Npm.COMMAND, ['test command'])
        .callCount,
    ).to.be.eq(1)
  })

  it('should properly execute script', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const npm = new Npm(commandExecuterStub)
    npm.executeScript('script')

    expect(
      commandExecuterStub.execute.withArgs(Npm.COMMAND, ['run', 'script'])
        .callCount,
    ).to.be.eq(1)
  })
})
