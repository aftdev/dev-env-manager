import type { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox } from 'sinon'
import DockerCompose from '#services/Environment/DockerCompose.js'
import Application from '#src/Application.js'
import { default as createTestContainer } from '#tests/feature/testHelpers.js'

describe('Environment Feature Tests', () => {
  let sandbox: SinonSandbox
  let application: Application
  let container: AwilixContainer

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

  it('builds docker compose environment and return same object', () => {
    const envManager = container.resolve('environmentManager')

    const test = envManager.get('docker-compose')
    const test2 = envManager.get('docker-compose')

    expect(test.constructor.name).to.eq('DockerCompose')

    expect(test2).to.be.equal(test)
    expect(test.isEnabled()).to.be.true

    const withOverride = envManager.get('dockerComposeWithOverride')
    expect(withOverride.isEnabled()).to.be.false
  })

  it('builds docker compose with different options', () => {
    const envManager = container.resolve('environmentManager')

    const withOverride = envManager.get('dockerComposeWithOverride')
    expect(withOverride.isEnabled()).to.be.false
  })

  it('executes the command on the right environment', async () => {
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
