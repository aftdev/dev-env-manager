import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '#services/CommandExecuter'
import Vagrant from '#services/Environment/Vagrant'

describe('Vagrant Env unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should return list of machines', () => {
    sandbox.stub(fs, 'existsSync').returns(true)

    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    // Stub return value of the docker compose command. (weak test)
    const serviceStub = `
1648267788,web,metadata,provider,virtualbox
1648267788,db,metadata,provider,virtualbox
1648267790,web,provider-name,virtualbox
1648267790,web,state,running
1648267790,web,state-human-short,running
1648267790,other,state,poweroff
1648267790,db,state,running
invalid,format
`
    commandExecuterStub.backgroundExecute.returns(serviceStub)
    const vagrant = new Vagrant(commandExecuterStub)

    expect(vagrant.hasMachine('web')).to.be.true
    expect(vagrant.hasMachine('db')).to.be.true
    expect(vagrant.hasMachine('other')).to.be.false
    expect(vagrant.hasMachine('unknown')).to.be.false
  })

  it('should properly execute command on machine', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const vagrant = new Vagrant(commandExecuterStub)

    vagrant.execute(['do', 'something'], { machine: 'web' })

    expect(
      commandExecuterStub.execute.withArgs(Vagrant.COMMAND, [
        'ssh',
        'web',
        '-c',
        ['do', 'something'],
      ]).callCount,
    ).to.be.eq(1)

    vagrant.execute(['do', 'something', 'on', 'default'], {})
    expect(
      commandExecuterStub.execute.withArgs(Vagrant.COMMAND, [
        'ssh',
        'default',
        '-c',
        ['do', 'something', 'on', 'default'],
      ]).callCount,
    ).to.be.eq(1)
  })

  it('should connect to a machine', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const vagrant = new Vagrant(commandExecuterStub)

    expect(() => {
      vagrant.connect({ 'no target': 'true' })
    }).to.throw('Please specify machine')

    vagrant.connect({ target: 'targetName' })
    const ttyStub = commandExecuterStub.tty.withArgs(Vagrant.COMMAND, [
      'ssh',
      'targetName',
    ])
    expect(ttyStub.callCount).to.equal(1)
  })

  const ops = [
    ['status', ['status']],
    ['start', ['up']],
    ['stop', ['halt']],
    ['setup', ['up', '--provision']],
  ]
  ops.forEach(([operation, args]) => {
    it(`should execute command ${operation}`, () => {
      const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
      const vagrant = new Vagrant(commandExecuterStub)

      vagrant[operation]()
      const stubCall = commandExecuterStub.execute.withArgs(
        Vagrant.COMMAND,
        args,
      )

      expect(stubCall.calledOnce).to.be.true
    })
  })
})
