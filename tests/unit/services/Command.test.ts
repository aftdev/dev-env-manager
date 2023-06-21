import child_process from 'child_process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStub } from 'sinon'
import Command, { CommandArgs } from '#services/Command.js'
import OutputFormatter from '#services/OutputFormatter.js'

describe('Command Tests', () => {
  let sandbox: SinonSandbox
  let outputFormatter: OutputFormatter
  let outputStub: SinonStub<[value: string], OutputFormatter>

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    outputFormatter = new OutputFormatter()
    outputStub = sandbox.stub(outputFormatter, 'output').returnsThis()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should quote command parameters properly', () => {
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

    const quoted = `${Command.quoteCommandArgs(args)}`
    expect(quoted).to.equal(expected)
  })

  describe('displayCommand', () => {
    it('should execute command and not show command if option is passed', () => {
      sandbox.stub(child_process, 'execSync')
      const command = new Command(
        'echo',
        ['test2'],
        { displayCommand: false },
        outputFormatter,
      )

      command.execute()

      expect(outputStub.called).to.be.false
    })
  })

  describe('execute', () => {
    it('should execute command and display it by default', () => {
      const command = new Command('echo', ['TEST'], {}, outputFormatter)

      const stub = sandbox.stub(child_process, 'execSync')

      command.execute()
      expect(stub.called).to.be.true
      expect(outputStub.withArgs(sinon.match('echo TEST')).calledOnce).to.be
        .true
    })
  })

  describe('tty', () => {
    it('should execute command and display it by default', () => {
      const command = new Command('echo', ['TTY'], {}, outputFormatter)

      const stub = sandbox.stub(child_process, 'spawnSync')

      command.tty()
      expect(stub.called).to.be.true

      expect(outputStub.withArgs(sinon.match('echo TTY')).calledOnce).to.be.true
    })
  })

  describe('json', () => {
    it('execute command and transform result to a json hash', () => {
      const command = new Command(
        'command',
        ['that', 'returns', 'json'],
        {},
        outputFormatter,
      )

      const stub = sandbox
        .stub(child_process, 'execSync')
        .callsFake(() => Buffer.from('{"fancy": "json", "object": true}'))

      const result = command.json()
      expect(stub.called).to.be.true

      const expected = { object: true, fancy: 'json' }
      expect(result).to.eql(expected)
    })

    it('should throw an error if json is invalid', () => {
      const command = new Command(
        'command',
        ['that', 'returns', 'json'],
        {},
        outputFormatter,
      )

      const stub = sandbox
        .stub(child_process, 'execSync')
        .callsFake(() => Buffer.from('invalid json'))

      expect(() => {
        command.json()
      }).to.throw()

      expect(stub.called).to.be.true
    })
  })

  describe('lines', () => {
    let command: Command
    beforeEach(() => {
      command = new Command(
        'command',
        ['that', 'returns', 'lines'],
        {},
        outputFormatter,
      )
    })

    it('execute command and split result into an array', () => {
      const stub = sandbox
        .stub(child_process, 'execSync')
        .callsFake(() =>
          Buffer.from('First line \n \nSecond line \n    Third line'),
        )

      const result = command.lines()
      expect(stub.called).to.be.true

      const expected = ['First line', 'Second line', 'Third line']
      expect(result).to.eql(expected)
    })

    it('splits on different separator', () => {
      const stub = sandbox
        .stub(child_process, 'execSync')
        .callsFake(() =>
          Buffer.from('First line , Second line ,    Third line'),
        )

      const result = command.lines(',')
      expect(stub.called).to.be.true

      const expected = ['First line', 'Second line', 'Third line']
      expect(result).to.eql(expected)
    })
  })
})
