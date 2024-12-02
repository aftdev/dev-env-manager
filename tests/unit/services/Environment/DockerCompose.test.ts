import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStubbedInstance } from 'sinon'
import Command, { CommandArgs } from '#services/Command'
import CommandExecuter from '#services/CommandExecuter'
import DockerCompose from '#services/Environment/DockerCompose'

describe('DockerCompose Env unit tests', () => {
  let sandbox: SinonSandbox
  let fakeCommand: Command
  let commandExecuterStub: SinonStubbedInstance<CommandExecuter>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    fakeCommand = new Command('fake')
    commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    commandExecuterStub.command.returns(fakeCommand)
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should execute commands properly with different config file', () => {
    const execStub = sandbox.stub(fakeCommand, 'execute')

    const dockerCompose = new DockerCompose(commandExecuterStub, [
      'differentCompose.json',
      'differentCompose2.json',
    ])

    dockerCompose.execute(['test command'])

    expect(
      commandExecuterStub.command.withArgs(DockerCompose.COMMAND, [
        { '--file': ['differentCompose.json', 'differentCompose2.json'] },
        'test command',
      ]).calledOnce,
    ).to.be.true

    expect(execStub.calledOnce).to.be.true
  })

  it('should return list of containers', () => {
    sandbox.stub(fs, 'existsSync').returns(true)
    sandbox.stub(fakeCommand, 'execute')

    // Stub return value of the docker compose command. (weak test)
    sandbox.stub(fakeCommand, 'executeInBackground').returns(
      Buffer.from(`
      app1
      app2
`),
    )

    const dockerCompose = new DockerCompose(commandExecuterStub)

    expect(dockerCompose.hasContainer('app1')).to.be.true
    expect(dockerCompose.hasContainer('app_not_found')).to.be.false
  })

  it('should properly execute command on container', () => {
    const commandStub = sandbox.stub(fakeCommand, 'execute')
    const dockerCompose = new DockerCompose(commandExecuterStub)

    dockerCompose.containerExecute('app1', ['do', 'something'])
    expect(
      commandExecuterStub.command.withArgs(DockerCompose.COMMAND, [
        'exec',
        'app1',
        'do',
        'something',
      ]).calledOnce,
    ).to.be.true

    dockerCompose.containerExecute('app1', ['do', 'something'], { root: true })

    expect(
      commandExecuterStub.command.withArgs(DockerCompose.COMMAND, [
        'exec',
        { '--user': 'root' },
        'app1',
        'do',
        'something',
      ]).calledOnce,
    ).to.be.true

    expect(commandStub.calledTwice).to.be.true
  })

  it('should connect to a container', () => {
    const commandStub = sandbox.stub(fakeCommand, 'tty')
    const dockerCompose = new DockerCompose(commandExecuterStub)

    expect(() => {
      // @ts-expect-error: using invalid parameter on purpose
      dockerCompose.connect({ 'no target': 'true' })
    }).to.throw('Please specify target')

    dockerCompose.connect({ target: 'targetName' })
    const ttyStub = commandExecuterStub.command.withArgs(
      DockerCompose.COMMAND,
      ['exec', 'targetName', 'bash'],
    )
    expect(ttyStub.callCount).to.equal(1)

    // With root.
    dockerCompose.connect({ target: 'targetName', root: true })
    const ttyStubWithRoot = commandExecuterStub.command.withArgs(
      DockerCompose.COMMAND,
      ['exec', { '--user': 'root' }, 'targetName', 'bash'],
    )
    expect(ttyStubWithRoot.callCount).to.equal(1)

    expect(commandStub.calledTwice).to.be.true
  })

  const ops: ['status' | 'start' | 'stop', CommandArgs][] = [
    ['status', ['ps']],
    ['start', ['up', '-d']],
    ['stop', ['down']],
  ]
  ops.forEach(([operation, args]) => {
    it(`should execute command ${operation}`, () => {
      const commandStub = sandbox.stub(fakeCommand, 'execute')
      const dockerCompose = new DockerCompose(commandExecuterStub)

      dockerCompose[operation]()
      const stubCall = commandExecuterStub.command.withArgs(
        DockerCompose.COMMAND,
        args,
      )
      expect(stubCall.calledOnce).to.be.true
      expect(commandStub.calledOnce).to.be.true
    })
  })
})
