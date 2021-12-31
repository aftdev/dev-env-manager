import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../src/services/CommandExecuter.js'
import Composer from '../../../src/services/Composer.js'

describe('Composer unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`execute commands properly`, () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const composer = new Composer(commandExecuterStub)
    composer.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(Composer.COMMAND, ['test command'])
        .callCount,
    ).to.be.eq(1)
  })

  it('should properly check if enabled or not', () => {
    sandbox.stub(fs, 'existsSync').returns(false).onFirstCall().returns(true)

    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const composer = new Composer(commandExecuterStub)

    expect(composer.isEnabled()).to.be.true
    expect(composer.isEnabled()).to.be.false
  })
})
