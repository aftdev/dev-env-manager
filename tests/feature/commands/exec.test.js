import child_process from 'child_process'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import {
  default as createTestContainer,
  stubOutputFormatter,
  stubEnquirer,
} from '../testHelpers.js'

describe('Exec command tests', () => {
  let sandbox, application, container, childProcessMock

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    stubOutputFormatter(container, sandbox)
    childProcessMock = sandbox.mock(child_process)
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should execute command on environment', async () => {
    childProcessMock.expects('execSync').never()
    childProcessMock
      .expects('execSync')
      .withArgs('docker-compose exec phpContainer php')
      .once()

    await application.run(['php'])
  })

  it('should error when command cannot be executed', async () => {
    const exitCode = await application.run(['unknown script or container'])
    expect(exitCode).to.equal(1)
  })

  it('should execute correct package manager script', () => {
    childProcessMock.expects('execSync').never()
    childProcessMock.expects('execSync').withArgs("npm run 'script a'").once()
    childProcessMock
      .expects('execSync')
      .withArgs('docker-compose run phpContainer php composer.phar composerA')
      .once()

    application.run(['script a'])
    application.run(['composerA'])
  })

  it('should show a prompt when script is in several managers', async () => {
    childProcessMock
      .expects('execSync')
      .withArgs('docker-compose run phpContainer php composer.phar scriptB')
      .once()
      .callsFake()

    stubEnquirer(container, { manager: 'Composer' })

    await application.run(['scriptB'])
  })
})
