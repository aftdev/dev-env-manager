import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../../src/services/CommandExecuter.js'
import Pnpm from '../../../../src/services/PackageManager/Pnpm.js'

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
    const pnpm = new Pnpm(commandExecuterStub)
    pnpm.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(Pnpm.COMMAND, ['test command'])
        .callCount,
    ).to.be.eq(1)
  })
})
