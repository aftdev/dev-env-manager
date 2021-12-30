import fs from 'fs'
import { expect } from 'chai'
import inquirer from 'inquirer'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import { default as createTestContainer } from '../testHelpers.js'

describe('Init command tests', () => {
  let sandbox, application, container

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(container.resolve('outputFormatter'), 'output')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should exit if file already exist', async () => {
    const stubExit = sandbox
      .stub(container.resolve('commandExecuter'), 'exitScriptWithError')
      .returns(false)
    application.run(['init'])

    expect(stubExit.calledOnce).to.be.true
  })

  it('should ask for confirmation before creating file', async () => {
    sandbox.stub(fs, 'existsSync').returns(false)
    const stubWrite = sandbox.stub(fs, 'writeFileSync')

    sandbox
      .stub(inquirer, 'prompt')
      .resolves({ confirm: true })
      .onFirstCall()
      .resolves({ confirm: false })

    // Without confirmation.
    await application.run(['init'])

    // With confirmation.
    await application.run(['init'])

    expect(stubWrite.calledOnce).to.be.true
  })
})
