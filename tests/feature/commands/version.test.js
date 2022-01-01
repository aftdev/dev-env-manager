import process from 'process'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import { default as createTestContainer } from '../testHelpers.js'

describe('Setup command tests', () => {
  let sandbox, application, container
  const stubs = {}

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    stubs.output = sandbox.stub(container.resolve('outputFormatter'), 'output')
    stubs.process = sandbox.stub(process, 'exit').throws({
      name: 'Fake Exit',
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should display version number', async () => {
    try {
      application.run(['--version'])
    } catch (err) {
      if ((err.name || null) !== 'Fake Exit') {
        expect.fail(err.message)
      }
    }

    expect(
      stubs.output.withArgs(sinon.match('Version')).calledOnce,
      'should display',
    ).to.be.true
  })
})
