import inquirer from 'inquirer'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import DockerCompose from '../../../src/services/DockerCompose.js'
import { default as createTestContainer } from '../testHelpers.js'

describe('Exec command tests', () => {
  let sandbox, application, container

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.verify()
    sandbox.restore()
  })

  it('should fallback to system', () => {
    const commandExecuter = container.resolve('commandExecuter')
    const mock = sandbox.mock(commandExecuter)

    const dockerCompose = container.resolve('dockerCompose')
    sandbox.stub(dockerCompose, 'hasContainer').returns(false)

    mock.expects('execute').callsFake().never()
    mock
      .expects('execute')
      .withArgs('unknown script or container')
      .once()
      .callsFake()

    application.run(['unknown script or container'])
  })

  it('should execute correct package manager script', () => {
    const commandExecuter = container.resolve('commandExecuter')
    const mock = sandbox.mock(commandExecuter)

    mock.expects('execute').callsFake().never()
    mock
      .expects('execute')
      .withArgs('npm', ['run', 'script a'])
      .once()
      .callsFake()
    mock
      .expects('execute')
      .withArgs('composer', ['composerA'])
      .once()
      .callsFake()

    application.run(['script a'])
    application.run(['composerA'])
  })

  it('should show a prompt when script is in several managers', async () => {
    const commandExecuter = container.resolve('commandExecuter')
    const mock = sandbox.mock(commandExecuter)

    mock.expects('execute').withArgs('composer', ['scriptB']).once().callsFake()

    sandbox.stub(inquirer, 'prompt').resolves({ manager: 'Composer' })

    await application.run(['scriptB'])
  })

  it('should execute correct docker-compose command', () => {
    const commandExecuter = container.resolve('commandExecuter')
    const dockerCompose = container.resolve('dockerCompose')

    const mock = sandbox.mock(commandExecuter)

    // Tell docker Compose to always return true
    sandbox.stub(dockerCompose, 'hasContainer').returns(true)

    mock.expects('execute').callsFake().never()
    mock.expects('execute').withArgs(DockerCompose.COMMAND).once().callsFake()

    application.run(['app1', 'echo', 'a'])
  })
})
