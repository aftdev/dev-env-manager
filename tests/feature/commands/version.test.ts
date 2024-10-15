import process from 'process'
import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStub } from 'sinon'
import { default as createTestContainer } from '../testHelpers.js'
import Application from '#src/Application.js'

describe('Version command tests', () => {
  let sandbox: SinonSandbox
  let application: Application
  let container: AwilixContainer
  const stubs: Record<string, SinonStub> = {}

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    const formatter = container.resolve('outputFormatter')
    stubs.log = sandbox.stub(formatter, 'log')
    stubs.process = sandbox.stub(process, 'exit').throws({
      name: 'Fake Exit',
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should display version number', async () => {
    application.run(['--version'])

    expect(
      stubs.log.withArgs(sinon.match.any, { title: 'Version', color: 'green' })
        .calledOnce,
      'should display',
    ).to.be.true
  })
})
