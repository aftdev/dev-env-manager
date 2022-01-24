import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../../src/services/CommandExecuter.js'
import Yarn from '../../../../src/services/PackageManager/Yarn.js'

describe('Yarn unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`execute commands properly`, () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const yarn = new Yarn(commandExecuterStub)
    yarn.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(Yarn.COMMAND, ['test command'])
        .callCount,
    ).to.be.eq(1)
  })
})
