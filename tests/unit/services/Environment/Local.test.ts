import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox } from 'sinon'
import CommandExecuter from '#services/CommandExecuter.js'
import Local from '#services/Environment/Local.js'

describe('Local Env unit tests', () => {
  let sandbox: SinonSandbox

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

  it('should always be enabled', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const localEnv = new Local(commandExecuterStub)

    expect(localEnv.isEnabled()).to.be.true
  })

  const ops: Array<keyof Local & string> = [
    'status',
    'start',
    'stop',
    'connect',
  ]

  ops.forEach((operation) => {
    it(`should be noop operation ${operation}`, () => {
      const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
      const localEnv = new Local(commandExecuterStub)

      localEnv[operation]()

      expect(localEnv[operation]()).to.be.undefined
    })
  })
})
