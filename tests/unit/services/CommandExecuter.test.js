import child_process from 'child_process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../src/services/CommandExecuter.js'

describe('CommandExecuter Tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should quote command parameters properly', () => {
    const executer = new CommandExecuter(sinon.fake())

    const args = [
      'something',
      { '--long': 'configA' },
      { '--longSpace': 'configB with space' },
      { '--longArray': ['a with space', 'b'] },
      { '-z': 'z' },
      { s: 'something' },
      { a: ['a', 'b with space'] },
      { withQuote: 'Quote"Me' },
      '-l',
      '--lonelyLong',
      '--',
      'other',
      ['a', 'b'],
    ]

    const expected =
      "something --long=configA --longSpace='configB with space' --longArray='a with space' --longArray=b -z z -s something -a a -a 'b with space' -withQuote 'Quote\"Me' -l --lonelyLong -- other a b"

    const quoted = `${executer.quoteCommandArgs(args)}`
    expect(quoted).to.equal(expected)
  })

  it('should execute command properly', () => {
    const mockOutput = {
      output: sinon.fake(),
      error: sinon.fake(),
    }

    sandbox
      .stub(child_process, 'execSync')
      .throws({ message: 'Something wrong happened', status: 111 })
      .onFirstCall()
      .callsFake(() => {})

    const executer = new CommandExecuter(mockOutput)

    // Test normal operation.
    executer.execute('echo', ['TEST'])

    expect(() => {
      executer.execute('with exception - should throw')
    }).to.throw()

    expect(mockOutput.output.callCount).to.be.equal(2)
  })

  it('should execute command in the background (no output)', () => {
    const executer = new CommandExecuter(sinon.fake())

    const stub = sandbox.stub(child_process, 'execSync').returns(true)

    executer.backgroundExecute('test command', ['ps', '--services'])

    expect(stub.withArgs('test command ps --services').callCount).to.be.equal(1)
  })

  it('should open tty subcommand', () => {
    const fakeOutput = {
      output: sinon.fake(),
      error: sinon.fake(),
    }
    const executer = new CommandExecuter(fakeOutput)

    const stub = sandbox.stub(child_process, 'spawnSync').returns(true)

    executer.tty('ssh', ['with', '--options'])

    expect(
      stub.withArgs('ssh', ['with', '--options'], sinon.match({ shell: true }))
        .callCount,
    ).to.be.equal(1)
  })
})
