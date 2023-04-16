import child_process from 'child_process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox } from 'sinon'
import CommandExecuter, { CommandArgs } from '#services/CommandExecuter.js'
import OutputFormatter from '#services/OutputFormatter.js'

describe('CommandExecuter Tests', () => {
  let sandbox: SinonSandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should quote command parameters properly', () => {
    const outputFormatter = sandbox.createStubInstance(OutputFormatter)
    const executer = new CommandExecuter(outputFormatter)

    const args: CommandArgs = [
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
    const outputFormatter = sandbox.createStubInstance(OutputFormatter)
    const executer = new CommandExecuter(outputFormatter)

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

    expect(outputFormatter.output.callCount).to.be.equal(2)
  })

  it('should execute command in the background (no output)', () => {
    const outputFormatter = sandbox.createStubInstance(OutputFormatter)
    const executer = new CommandExecuter(outputFormatter)

    const stub = sandbox
      .stub(child_process, 'execSync')
      .returns(Buffer.from(''))

    executer.backgroundExecute('test command', ['ps', '--services'])

    expect(stub.withArgs('test command ps --services').callCount).to.be.equal(1)
  })

  it('should open tty subcommand', () => {
    const outputFormatter = sandbox.createStubInstance(OutputFormatter)
    const executer = new CommandExecuter(outputFormatter)

    const stub = sandbox
      .stub(child_process, 'spawnSync')
      // @ts-expect-error: faking spawn
      .returns(true)

    executer.tty('ssh', ['with', '--options'])

    expect(
      stub.withArgs('ssh', ['with', '--options'], sinon.match({ shell: true }))
        .callCount,
    ).to.be.equal(1)
  })
})
