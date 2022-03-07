import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../../src/services/CommandExecuter.js'
import DockerCompose from '../../../../src/services/Environment/DockerCompose.js'

describe('DockerCompose Env unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should execute commands properly with different config file', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const dockerCompose = new DockerCompose(commandExecuterStub, [
      'differentCompose.json',
      'differentCompose2.json',
    ])

    dockerCompose.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(DockerCompose.COMMAND, [
        { '--file': ['differentCompose.json', 'differentCompose2.json'] },
        'test command',
      ]).callCount,
    ).to.be.eq(1)
  })

  it('should return list of containers', () => {
    sandbox.stub(fs, 'existsSync').returns(true)

    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    // Stub return value of the docker compose command. (weak test)
    const serviceStub = `
app1
app2
`

    commandExecuterStub.backgroundExecute.returns(serviceStub)
    const dockerCompose = new DockerCompose(commandExecuterStub)

    expect(dockerCompose.hasContainer('app1')).to.be.true
    expect(dockerCompose.hasContainer('app_not_found')).to.be.false
  })

  it('should properly execute command on container', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const dockerCompose = new DockerCompose(commandExecuterStub)

    dockerCompose.containerExecute('app1', ['do', 'something'])
    expect(
      commandExecuterStub.execute.withArgs(DockerCompose.COMMAND, [
        'exec',
        'app1',
        'do',
        'something',
      ]).callCount,
    ).to.be.eq(1)

    dockerCompose.containerExecute('app1', ['do', 'something'], { root: true })

    expect(
      commandExecuterStub.execute.withArgs(DockerCompose.COMMAND, [
        'exec',
        { '--user': 'root' },
        'app1',
        'do',
        'something',
      ]).callCount,
    ).to.be.eq(1)
  })

  it('should connect to a container', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const dockerCompose = new DockerCompose(commandExecuterStub)

    expect(() => {
      dockerCompose.connect({ 'no target': 'true' })
    }).to.throw('Please specify target')

    dockerCompose.connect({ target: 'targetName' })
    const ttyStub = commandExecuterStub.tty.withArgs(DockerCompose.COMMAND, [
      'exec',
      'targetName',
      'bash',
    ])
    expect(ttyStub.callCount).to.equal(1)

    // With root.
    dockerCompose.connect({ target: 'targetName', root: true })
    const ttyStubWithRoot = commandExecuterStub.tty.withArgs(
      DockerCompose.COMMAND,
      ['exec', { '--user': 'root' }, 'targetName', 'bash'],
    )
    expect(ttyStubWithRoot.callCount).to.equal(1)
  })

  const ops = [
    ['status', ['ps']],
    ['start', ['up', '-d']],
    ['stop', ['down']],
  ]
  ops.forEach(([operation, args]) => {
    it(`should execute command ${operation}`, () => {
      const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
      const dockerCompose = new DockerCompose(commandExecuterStub)

      dockerCompose[operation]()
      const stubCall = commandExecuterStub.execute.withArgs(
        DockerCompose.COMMAND,
        args,
      )
      expect(stubCall.calledOnce).to.be.true
    })
  })
})
