import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../src/services/CommandExecuter.js'
import Npm from '../../../src/services/Npm.js'

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

  it('should properly check if enabled or not', () => {
    sandbox.stub(fs, 'existsSync').returns(false).onFirstCall().returns(true)

    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const npm = new Npm(commandExecuterStub)

    expect(npm.isEnabled()).to.be.true
    expect(npm.isEnabled()).to.be.false
  })
})
