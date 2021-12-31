import process from 'process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import runApp from '../../src/index.js'

describe('Index Feature Tests', () => {
  let sandbox, stdoutStub

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(process, 'argv').value(['a', 'b'])
    stdoutStub = sandbox.stub(process.stdout, 'write').callsFake()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should execute main file', async () => {
    await runApp()

    expect(
      stdoutStub.withArgs(sinon.match('Command line utilities')).calledOnce,
    ).to.be.true
  })

  it('should find dev config file', async () => {
    process.chdir('./tests/feature/files/project1')
    await runApp()

    expect(
      stdoutStub.withArgs(sinon.match('Command line utilities')).calledOnce,
    ).to.be.true
  })
})
