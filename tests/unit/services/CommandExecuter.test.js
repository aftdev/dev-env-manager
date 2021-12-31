import child_process from 'child_process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../src/services/CommandExecuter.js'

describe('CommandExecute Tests', () => {
  const scenarios = {
    'target command': 'target command',
    commandWithTargetSimpleNotation: {
      use: 'simple target command',
    },
    commandWithTarget: {
      use: {
        target: 'target command',
      },
    },
    editedCommandSimpleNotation: 'edited command',
    editedCommand: {
      command: 'edited command',
    },
    editedCommandWithTarget: {
      command: 'edited command',
      use: {
        target: 'target command',
      },
    },
    editedCommandWithTargetAndOptions: {
      command: 'edited command',
      use: {
        target: 'target command',
        with: '[target options]',
      },
    },
    commandWithInvalidTarget: {
      use: {
        with: 'missing target',
      },
    },
    cycleDependency: {
      use: {
        target: 'cycleDependencyTwo',
      },
    },
    cycleDependencyTwo: {
      use: 'cycleDependency',
    },
    cycleDependencyOk: {
      use: {
        target: 'commandWithTarget',
      },
    },
  }
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  const data = [
    [
      'commandWithTargetSimpleNotation',
      'simple target command commandWithTargetSimpleNotation',
    ],
    ['commandWithTarget', 'target command commandWithTarget'],
    ['editedCommandSimpleNotation', 'edited command'],
    ['editedCommand', 'edited command'],
    ['editedCommandWithTarget', 'target command edited command'],
    [
      'editedCommandWithTargetAndOptions',
      "target command '[target options]' edited command",
    ],
    ['cycleDependency', new RangeError('Circular dependency error !')],
    ['cycleDependencyOk', 'target command commandWithTarget cycleDependencyOk'],
    ['commandWithInvalidTarget', 'commandWithInvalidTarget'],
  ]

  data.forEach(([commandToTest, expected]) => {
    it(`should execute command properly with ${commandToTest}`, () => {
      const executer = new CommandExecuter(scenarios, sinon.fake())

      if (typeof expected === 'string') {
        expect(executer.getCommandFor(commandToTest)).to.equal(expected)
      } else {
        expect(() => {
          executer.getCommandFor(commandToTest)
        }).to.throw(RangeError)
      }
    })
  })

  it('should quote command parameters properly', () => {
    const executer = new CommandExecuter({}, sinon.fake())

    const command = executer.getCommandFor('test', [
      'sdfsdfb',
      '--option=1 2 3',
      '-s',
      '--test',
      '--withQuotes="test test test"',
      "--withSingleQuotes='test test'",
    ])

    expect(command).to.equal(
      "test sdfsdfb '--option=1 2 3' -s --test '--withQuotes=\"test test test\"' '--withSingleQuotes='test test''",
    )
  })

  it('should execute command properly', () => {
    const mockOutput = {
      output: sinon.fake(),
      error: sinon.fake(),
    }

    sandbox.stub(process, 'exit').returns(0)
    sandbox
      .stub(child_process, 'execSync')
      .throws({ message: 'Something wrong happened', status: 111 })
      .onFirstCall()
      .callsFake(() => {})

    const executer = new CommandExecuter({}, mockOutput)

    // Test normal operation.
    executer.execute('echo TEST')

    executer.execute('with exception - should display error message and quit')

    // Test exception without catching it
    expect(() => {
      executer.execute('will just throw', [], false)
    }).to.throw()

    expect(mockOutput.output.callCount).to.be.equal(3)
    expect(mockOutput.error.callCount).to.be.equal(1)
  })

  it('should execute command in the background (no output)', () => {
    const executer = new CommandExecuter({}, sinon.fake())

    const stub = sandbox.stub(child_process, 'execSync').returns(true)

    executer.backgroundExecute('test command', ['ps', '--services'])

    expect(stub.withArgs('test command ps --services').callCount).to.be.equal(1)
  })
})
