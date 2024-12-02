import child_process from 'child_process'
import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonMock, SinonSandbox } from 'sinon'
import Application from '#src/Application'
import {
  default as createTestContainer,
  stubOutputFormatter,
  stubEnquirer,
} from '#tests/feature/testHelpers'

describe('Exec command tests', () => {
  let sandbox: SinonSandbox
  let application: Application
  let container: AwilixContainer
  let childProcessMock: SinonMock

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
      .withArgs('docker compose exec phpContainer php')
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
      .withArgs('docker compose run phpContainer php composer.phar composerA')
      .once()

    application.run(['script a'])
    application.run(['composerA'])
  })

  it('should show a prompt when script is in several managers', async () => {
    childProcessMock
      .expects('execSync')
      .withArgs('docker compose run phpContainer php composer.phar scriptB')
      .once()
      .callsFake(() => true)

    stubEnquirer(container, { manager: 'Composer' })

    await application.run(['scriptB'])
  })
})
