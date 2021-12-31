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
    sandbox.stub(container.resolve('outputFormatter'), 'output')

    stubs.dockerCompose = sandbox.stub(
      container.resolve('dockerCompose'),
      'execute',
    )
    stubs.composer = sandbox.stub(container.resolve('composer'), 'execute')
    stubs.npm = sandbox.stub(container.resolve('npm'), 'execute')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should setup environment', async () => {
    application.run(['setup'])

    expect(stubs.dockerCompose.calledTwice, 'should setup docker-compose').to.be
      .true
    expect(stubs.composer.calledOnce, 'should setup composer').to.be.true
    expect(stubs.npm.calledOnce, 'should setup npm').to.be.true
  })
})
