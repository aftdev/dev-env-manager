import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox } from 'sinon'
import Application from '#src/Application.js'
import {
  default as createTestContainer,
  stubCliOutput,
} from '#tests/feature/testHelpers.js'

describe('Applications Feature Tests', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  describe('Project 1', () => {
    let application: Application
    let container: AwilixContainer

    beforeEach(async () => {
      container = await createTestContainer('project1')
      application = container.resolve('application')
      await application.bootstrap()
    })

    it('should bootstrap application properly', () => {
      const cli = container.resolve('cli')

      expect(cli.commands.length).to.be.gt(0)
    })

    it('should gather defaults and project commands', () => {
      const outputFormatter = container.resolve('outputFormatter')
      const stub = sandbox.stub(outputFormatter, 'log')

      application.run(['project1_command_a'])
      expect(
        stub.calledWith('Hello from Project 1 - folder A'),
        'Should execute project command from first folder',
      ).to.be.true

      application.run(['project1_command_b'])
      expect(
        stub.calledWith('Hello from Project 1 - folder B'),
        'Should execute project command from other folder',
      ).to.be.true

      application.run(['project1_command_cjs'])
      expect(
        stub.calledWith('Hello from Project 1 - folder A - CJS'),
        'Should execute project command written in cjs',
      ).to.be.true
    })

    it('should display help message with information about package commands', () => {
      const outputStub = stubCliOutput(container)

      application.run([])

      expect(
        outputStub.calledWith(sinon.match('script a')),
        'Should find script a command',
      ).to.be.true
      expect(
        outputStub.calledWith(sinon.match('scriptB')),
        'Should find scriptB command',
      ).to.be.true
    })

    describe('debug mode', () => {
      let writeStub: sinon.SinonStub

      beforeEach(() => {
        writeStub = sandbox.stub(process.stdout, 'write').callsFake(() => true)
      })

      it('display debug messages in debug mode', async () => {
        application.run(['--debug', 'debug_test'])

        expect(writeStub.calledWith(sinon.match('Debug message'))).to.be.true
      })

      it('ignores debug messages', () => {
        application.run(['debug_test'])

        expect(writeStub.calledWith(sinon.match('Debug message'))).to.be.false
      })
    })
  })

  describe('Project 2', () => {
    let application: Application
    let container: AwilixContainer

    before(async () => {
      container = await createTestContainer('project2')
      application = container.resolve('application')
      await application.bootstrap()
    })

    it('should bootstrap application properly', () => {
      const cli = container.resolve('cli')
      expect(cli.commands.length).to.be.gt(0)
    })

    it('should display help message properly without package manager commands', () => {
      const outputStub = stubCliOutput(container)

      application.run([])
      expect(outputStub.calledWith(sinon.match('Command line utilities'))).to.be
        .true
      expect(outputStub.calledWith(sinon.match('commands:'))).to.be.false
    })
  })

  describe('Invalid Project', () => {
    let application: Application
    let container: AwilixContainer

    before(async () => {
      container = await createTestContainer('invalid')
      application = container.resolve('application')
    })

    it('should throw if not bootstrapped', async () => {
      const outputFormatter = container.resolve('outputFormatter')
      const stub = sandbox.stub(outputFormatter, 'error').returnsThis()

      const status = await application.run([])
      expect(status).to.equal(1)
      expect(
        stub.calledWith(
          sinon.match.has('message', 'Application not bootstrapped'),
        ),
      ).to.be.true
    })

    it('should capture errors in commands', async () => {
      const outputFormatter = container.resolve('outputFormatter')
      const warnStub = sandbox.stub(outputFormatter, 'warning').returnsThis()
      const errorStub = sandbox.stub(outputFormatter, 'error').returnsThis()

      try {
        await application.bootstrap()
        expect.fail('should have thrown an error')
      } catch {
        expect(
          warnStub.calledWith(
            sinon.match('Not all command files could be bootstrapped'),
          ),
        ).to.be.true

        expect(errorStub.called).to.be.true
      }
    })
  })
})
