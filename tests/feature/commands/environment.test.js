import { expect } from 'chai'
import inquirer from 'inquirer'
import { before, beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import { default as createTestContainer } from '../testHelpers.js'

describe('Environment command tests', () => {
  let sandbox, application, container
  const stubs = {}

  before(async () => {
    container = await createTestContainer('project1')
    application = container.resolve('application')
    await application.bootstrap()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    stubs.dockerCompose = sandbox
      .stub(container.resolve('dockerCompose'), 'execute')
      .callsFake()
    stubs.outputFormatter = sandbox
      .stub(container.resolve('outputFormatter'), 'output')
      .callsFake()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should start env', () => {
    application.run(['start'])
    expect(
      stubs.dockerCompose.withArgs(sinon.match.array.startsWith(['up']))
        .callCount,
    ).to.equal(1)
  })

  it('should stop env', () => {
    application.run(['stop'])
    expect(
      stubs.dockerCompose.withArgs(sinon.match.array.startsWith(['down']))
        .callCount,
    ).to.equal(1)
  })

  it('should display status message', () => {
    application.run(['status'])
    expect(stubs.dockerCompose.withArgs(['ps']).callCount).to.equal(1)
  })

  describe('should connect to container', () => {
    let dockerCompose, containerExecuteStub
    beforeEach(() => {
      dockerCompose = container.resolve('dockerCompose')
      containerExecuteStub = sandbox
        .stub(dockerCompose, 'containerExecute')
        .callsFake()
    })

    it('should exit if no container up', async () => {
      sandbox.stub(dockerCompose, 'getContainers').returns([])
      const processStub = sandbox.stub(process, 'exit')

      application.run(['connect'])
      expect(processStub.callCount).to.equal(1)
    })

    it('should connect to container after being prompted', async () => {
      sandbox
        .stub(dockerCompose, 'getContainers')
        .returns(['app1', 'app2', 'app3'])
      sandbox.stub(inquirer, 'prompt').resolves({ container: 'app1' })

      await application.run(['connect'])
      expect(containerExecuteStub.withArgs('app1').callCount).to.equal(1)
    })

    it('should connect to container from arg', async () => {
      sandbox
        .stub(dockerCompose, 'getContainers')
        .returns(['app1', 'app2', 'app3'])

      await application.run(['connect', 'app5'])
      expect(containerExecuteStub.withArgs('app5').callCount).to.equal(1)

      // As root
      await application.run(['connect', 'app5', '-r'])
      expect(
        containerExecuteStub.withArgs('app5', sinon.match.any, true).callCount,
      ).to.equal(1)
    })
  })
})
