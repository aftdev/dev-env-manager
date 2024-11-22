import child_process from 'child_process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStubbedInstance } from 'sinon'
import CommandExecuter from '#services/CommandExecuter.js'
import OutputFormatter from '#services/OutputFormatter.js'

describe('CommandExecuter Tests', () => {
  let sandbox: SinonSandbox
  let outputFormatterStub: SinonStubbedInstance<OutputFormatter>

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    outputFormatterStub = sinon.createStubInstance(OutputFormatter)
    outputFormatterStub.start.returnsThis()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should execute command properly', () => {
    const executer = new CommandExecuter(outputFormatterStub)

    sandbox
      .stub(child_process, 'execSync')
      .throws({ message: 'Something wrong happened', status: 111 })
      .onFirstCall()
      .callsFake(() => Buffer.from(''))

    // Test normal operation.
    executer.execute('echo', ['TEST'])

    expect(() => {
      executer.execute('with exception - should throw')
    }).to.throw()

    expect(outputFormatterStub.start.calledWith(sinon.match('echo TEST'))).to.be
      .true
    expect(
      outputFormatterStub.start.calledWith(
        sinon.match('with exception - should throw'),
      ),
    ).to.be.true
  })

  it('should execute command in the background (no output)', () => {
    const executer = new CommandExecuter(outputFormatterStub)

    const stub = sandbox
      .stub(child_process, 'execSync')
      .returns(Buffer.from(''))

    executer.backgroundExecute('test command', ['ps', '--services'])

    expect(stub.calledWith('test command ps --services')).to.be.true
    expect(outputFormatterStub.start.called).to.be.false
  })

  it('should open tty subcommand', () => {
    const executer = new CommandExecuter(outputFormatterStub)

    const stub = sandbox
      .stub(child_process, 'spawnSync')
      // @ts-expect-error: faking spawn
      .returns(true)

    executer.tty('ssh', ['with', '--options'])

    expect(
      stub.calledWith('ssh with --options', [], sinon.match({ shell: true })),
    ).to.be.true

    expect(
      outputFormatterStub.start.calledWith(sinon.match('ssh with --options')),
    ).to.be.true
  })
})
