import fs from 'fs'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import { default as createTestContainer, stubEnquirer } from '../testHelpers.js'

describe('Init command tests', () => {
  let sandbox, application, container

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(container.resolve('outputFormatter'), 'output').returnsThis()
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
