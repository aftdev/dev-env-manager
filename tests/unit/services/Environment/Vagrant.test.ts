import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStubbedInstance } from 'sinon'
import Command, { CommandArgs } from '#services/Command'
import CommandExecuter from '#services/CommandExecuter'
import Vagrant from '#services/Environment/Vagrant'

describe('Vagrant Env unit tests', () => {
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

  it('should return list of machines', () => {
    sandbox.stub(fs, 'existsSync').returns(true)

    // Stub return value of the vagrant command. (weak test)
    sandbox.stub(fakeCommand, 'executeInBackground').returns(
      Buffer.from(`
1648267788,web,metadata,provider,virtualbox
1648267788,db,metadata,provider,virtualbox
1648267790,web,provider-name,virtualbox
1648267790,web,state,running
1648267790,web,state-human-short,running
1648267790,other,state,poweroff
1648267790,db,state,running
invalid,format
`),
    )

    const vagrant = new Vagrant(commandExecuterStub)

    expect(vagrant.hasMachine('web')).to.be.true
    expect(vagrant.hasMachine('db')).to.be.true
    expect(vagrant.hasMachine('other')).to.be.false
    expect(vagrant.hasMachine('unknown')).to.be.false
  })

  it('should properly execute command on machine', () => {
    sandbox.stub(fakeCommand, 'execute')

    const vagrant = new Vagrant(commandExecuterStub)

    vagrant.execute(['do', 'something'], { machine: 'web' })

    expect(
      commandExecuterStub.command.withArgs(Vagrant.COMMAND, [
        'ssh',
        'web',
        '-c',
        'do',
        'something',
      ]).callCount,
    ).to.be.eq(1)

    vagrant.execute(['do', 'something', 'on', 'default'], {})
    expect(
      commandExecuterStub.command.withArgs(Vagrant.COMMAND, [
        'ssh',
        'default',
        '-c',
        'do',
        'something',
        'on',
        'default',
      ]).callCount,
    ).to.be.eq(1)
  })

  it('should connect to a machine', () => {
    const vagrant = new Vagrant(commandExecuterStub)
    const ttyStub = sandbox.stub(fakeCommand, 'tty')

    expect(() => {
      // @ts-expect-error: passing invalid value on purpose
      vagrant.connect({ 'no target': 'true' })
    }).to.throw('Please specify machine')

    vagrant.connect({ target: 'targetName' })
    expect(
      commandExecuterStub.command.withArgs(Vagrant.COMMAND, [
        'ssh',
        'targetName',
      ]).calledOnce,
    ).to.be.true

    expect(ttyStub.calledOnce).to.be.true
  })

  const ops: ['status' | 'start' | 'stop' | 'setup', CommandArgs][] = [
    ['status', ['status']],
    ['start', ['up']],
    ['stop', ['halt']],
    ['setup', ['up', '--provision']],
  ]

  ops.forEach(([operation, args]) => {
    it(`should execute command ${operation}`, () => {
      sandbox.stub(fakeCommand, 'execute')
      const vagrant = new Vagrant(commandExecuterStub)

      vagrant[operation]()
      const stubCall = commandExecuterStub.command.withArgs(
        Vagrant.COMMAND,
        args,
      )

      expect(stubCall.calledOnce).to.be.true
    })
  })
})
