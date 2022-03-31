import { expect } from 'chai'
import inquirer from 'inquirer'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import { default as createTestContainer } from '#tests/feature/testHelpers'

describe('Environment command tests', () => {
  let sandbox, application, container
  let envManager, dockerCompose, dockerComposeOverride, localEnv

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()

    envManager = container.resolve('environmentManager')
    dockerCompose = envManager.get('docker-compose')
    dockerComposeOverride = envManager.get('dockerComposeWithOverride')
    localEnv = envManager.get('local')
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    sandbox.stub(dockerCompose, 'isEnabled').returns(true)
    sandbox.stub(dockerComposeOverride, 'isEnabled').returns(true)
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should start env', () => {
    const dockerComposeStub = sandbox.stub(dockerCompose, 'start')
    const dockerComposeStub2 = sandbox.stub(dockerComposeOverride, 'start')
    const localStub = sandbox.stub(localEnv, 'start')

    application.run(['start'])

    expect(dockerComposeStub.called).to.be.true
    expect(dockerComposeStub2.called).to.be.true
    expect(localStub.called).to.be.false
  })

  it('should stop env', () => {
    const dockerComposeStub = sandbox.stub(dockerCompose, 'stop')
    const dockerComposeStub2 = sandbox.stub(dockerComposeOverride, 'stop')
    const localStub = sandbox.stub(localEnv, 'stop')

    application.run(['stop'])

    expect(dockerComposeStub.called).to.be.true
    expect(dockerComposeStub2.called).to.be.true
    expect(localStub.called).to.be.false
  })

  it('should display status message', () => {
    const dockerComposeStub = sandbox.stub(dockerCompose, 'status')
    const dockerComposeStub2 = sandbox.stub(dockerComposeOverride, 'status')
    const localStub = sandbox.stub(localEnv, 'status')

    application.run(['status'])

    expect(dockerComposeStub.called).to.be.true
    expect(dockerComposeStub2.called).to.be.true
    expect(localStub.called).to.be.false
  })

  it('should connect to a target', async () => {
    sandbox
      .stub(dockerCompose, 'getTargets')
      .returns(['containerA', 'containerB'])

    sandbox.stub(dockerComposeOverride, 'getTargets').returns(['containerC'])

    const inquirerStub = sandbox
      .stub(inquirer, 'prompt')
      .resolves({ target: 'containerC' })

    const dockerComposeConnectStub = sandbox.stub(dockerCompose, 'connect')
    const dockerComposeOverrideConnectStub = sandbox.stub(
      dockerComposeOverride,
      'connect',
    )

    // Asking for target.
    await application.run(['connect'])
    expect(inquirerStub.calledOnce).to.be.true
    expect(dockerComposeOverrideConnectStub.called).to.be.true
    sandbox.resetHistory()

    // With given target
    await application.run(['connect', 'containerA'])
    expect(dockerComposeConnectStub.called).to.be.true
    sandbox.resetHistory()

    // With Root option.
    await application.run(['connect', 'containerA', '-r'])
    const rootCall = dockerComposeConnectStub.withArgs(
      sinon.match({ root: true }),
    )
    expect(rootCall.calledOnce).to.be.true
  })

  it('connects to lone target automatically', async () => {
    sandbox.stub(dockerCompose, 'getTargets').returns(['SoLonely'])
    sandbox.stub(dockerComposeOverride, 'getTargets').returns([])

    const dockerComposeConnectStub = sandbox.stub(dockerCompose, 'connect')

    await application.run(['connect'])

    expect(dockerComposeConnectStub.called).to.be.true
  })

  it('should error when trying to connect if no targets or target invalid', async () => {
    sandbox.stub(dockerCompose, 'getTargets').returns([])
    sandbox
      .stub(dockerComposeOverride, 'getTargets')
      .onFirstCall()
      .returns([])
      .onSecondCall()
      .returns(['a', 'b', 'c'])

    const outputFormatter = container.resolve('outputFormatter')
    const outputStub = sandbox.stub(outputFormatter, 'output')

    const exitCode = await application.run(['connect'])

    expect(exitCode).to.equal(1)
    expect(outputStub.withArgs(sinon.match('No targets found')).called).to.be
      .true

    const exitCodeWithInvalid = await application.run([
      'connect',
      'invalidcontainer',
    ])
    expect(exitCodeWithInvalid).to.equal(1)
    expect(outputStub.withArgs(sinon.match('Invalid target')).called).to.be.true
  })

  it('should setup environment', () => {
    sandbox.stub(container.resolve('outputFormatter'), 'output').returnsThis()
    const dockerComposeStub = sandbox.stub(
      dockerCompose,
      'dockerComposeCommand',
    )
    const dockerComposeOverrideStub = sandbox.stub(
      dockerComposeOverride,
      'dockerComposeCommand',
    )
    const composer = sandbox.stub(container.resolve('composer'), 'execute')
    const npm = sandbox.stub(container.resolve('node'), 'execute')

    application.run(['setup'])

    expect(dockerComposeStub.calledTwice, 'should setup docker-compose').to.be
      .true
    expect(dockerComposeOverrideStub.calledTwice, 'should setup docker-compose')
      .to.be.true

    expect(composer.calledOnce, 'should setup composer').to.be.true
    expect(npm.calledOnce, 'should setup npm').to.be.true
  })
})
