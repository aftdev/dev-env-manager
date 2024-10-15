import fs from 'fs'
import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox } from 'sinon'
import {
  default as createTestContainer,
  stubEnquirer,
  stubOutputFormatter,
} from '../testHelpers.js'
import Application from '#src/Application.js'

describe('Init command tests', () => {
  let sandbox: SinonSandbox
  let application: Application
  let container: AwilixContainer

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    stubOutputFormatter(container, sandbox)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should throw error if file already exists', async () => {
    const status = await application.run(['init'])
    expect(status).to.equal(1)
  })

  it('should ask for confirmation before creating file', async () => {
    sandbox.stub(fs, 'existsSync').returns(false)
    const stubWrite = sandbox.stub(fs, 'writeFileSync')

    // Without confirmation.
    stubEnquirer(container, { confirm: false })
    await application.run(['init'])

    // With confirmation.
    stubEnquirer(container, { confirm: true })
    await application.run(['init'])

    expect(stubWrite.calledOnce).to.be.true
  })
})
