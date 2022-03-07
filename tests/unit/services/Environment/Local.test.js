import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../../src/services/CommandExecuter.js'
import Local from '../../../../src/services/Environment/Local.js'

describe('Local Env unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should always be enabled', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const localEnv = new Local(commandExecuterStub)

    expect(localEnv.isEnabled()).to.be.true
  })

  /*it('should properly execute command ', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const dockerCompose = new DockerCompose(commandExecuterStub)
  })*/
})
