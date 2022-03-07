import child_process from 'child_process'
import inquirer from 'inquirer'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import {
  default as createTestContainer,
  stubOutputFormatter,
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

  it('should fallback to system', () => {
    const dockerCompose = container.resolve('dockerCompose')
    sandbox.stub(dockerCompose, 'hasContainer').returns(false)

    childProcessMock.expects('execSync').never()
    childProcessMock
      .expects('execSync')
      .withArgs('unknown script or container')
      .once()

    application.run(['unknown script or container'])
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

    sandbox.stub(inquirer, 'prompt').resolves({ manager: 'Composer' })

    await application.run(['scriptB'])
  })
})
