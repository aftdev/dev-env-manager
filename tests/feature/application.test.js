import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import { default as createTestContainer, mockCliOutput } from './testHelpers.js'

describe('Applications Feature Tests', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  describe('Project 1', () => {
    let application, container

    before(async () => {
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
      const stub = sandbox.stub(outputFormatter, 'output')

      application.run(['project1_command'])
      expect(
        stub.calledWith('Hello from Project 1'),
        'Should execute project command',
      ).to.be.true
    })

    it('should display help message with information about package commands.', () => {
      const outputStub = mockCliOutput(container)

      application.run([])

      expect(outputStub.calledWith(sinon.match('Package manager commands:'))).to
        .be.true
      expect(
        outputStub.calledWith(sinon.match('script a')),
        'Should find script a command',
      ).to.be.true
      expect(
        outputStub.calledWith(sinon.match('scriptB')),
        'Should find scriptB command',
      ).to.be.true
    })
  })

  describe('Project 2', () => {
    let application, container

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
      const outputStub = mockCliOutput(container)

      application.run([])

      expect(outputStub.calledWith(sinon.match('Package manager commands:'))).to
        .be.false
    })
  })

  describe('Invalid Project', () => {
    let application, container
    before(async () => {
      container = await createTestContainer('invalid')
      application = container.resolve('application')
    })

    it('should throw if not bootstrapped', async () => {
      expect(() => {
        application.run([])
      }).to.throw()
    })

    it('should capture errors in commands', async () => {
      const outputFormatter = container.resolve('outputFormatter')
      const stub = sandbox.stub(outputFormatter, 'output')

      try {
        await application.bootstrap()
        expect.fail('should have thrown an error')
      } catch (err) {
        expect(
          stub.calledWith(
            sinon.match('Not all command files could be bootstrapped'),
          ),
        ).to.be.true
      }
    })
  })
})
