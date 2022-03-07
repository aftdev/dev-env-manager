import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import DockerCompose from '#services/Environment/DockerCompose'
import { default as createTestContainer } from '#tests/feature/testHelpers'

describe('Environment Feature Tests', () => {
  let sandbox
  let application, container

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should build docker compose env and return same object', () => {
    const envManager = container.resolve('environmentManager')

    const test = envManager.get('docker-compose')
    const test2 = envManager.get('docker-compose')

    expect(test).to.be.instanceOf(DockerCompose)
    expect(test2).to.be.equal(test)
    expect(test.isEnabled()).to.be.true

    const withOverride = envManager.get('dockerComposeWithOverride')
    expect(withOverride.isEnabled()).to.be.false
  })

  it('should build docker compose with different options', () => {
    const envManager = container.resolve('environmentManager')

    const withOverride = envManager.get('dockerComposeWithOverride')
    expect(withOverride.isEnabled()).to.be.false
  })

  it('should execute the command on the right environment', async () => {
    const commandExecuter = container.resolve('commandExecuter')

    const stub = sandbox.stub(commandExecuter, 'execute')

    const envManager = container.resolve('environmentManager')

    // Command that should be executed on docker-compose
    envManager.executeCommand('php', ['test', 'a', 'b'])
    expect(stub.lastCall.firstArg).to.be.equal(DockerCompose.COMMAND)

    // Command that can be overridden
    envManager.executeCommand('composer', ['test', 'a', 'b'])
    expect(stub.lastCall.firstArg).to.be.equal(DockerCompose.COMMAND)

    // Unknown env - fallback to local
    envManager.executeCommand('iwasnotsetup', ['test', 'a', 'b'])
    expect(stub.lastCall.firstArg).to.be.equal('iwasnotsetup')
  })
})
