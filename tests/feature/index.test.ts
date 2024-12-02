import process from 'process'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStub } from 'sinon'
import runApp from '#src/index'

describe('Index Feature Tests', () => {
  let sandbox: SinonSandbox
  let stdoutStub: SinonStub
  let stderrStub: SinonStub

  const oldCwd = process.cwd()

  beforeEach(() => {
    process.chdir(oldCwd)
    sandbox = sinon.createSandbox()
    sandbox.stub(process, 'argv').value(['a', 'b'])
    stdoutStub = sandbox.stub(process.stdout, 'write').callsFake(() => true)
    stderrStub = sandbox.stub(process.stderr, 'write').callsFake(() => true)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should execute main file', async () => {
    await runApp()

    expect(stdoutStub.withArgs(sinon.match('Dev Env Manager')).calledOnce).to.be
      .true
  })

  it('should find dev config file', async () => {
    process.chdir('./tests/feature/files/project1')
    await runApp()

    expect(
      stdoutStub.withArgs(sinon.match('Command line utilities')).calledOnce,
    ).to.be.true
  })

  it('should return exit code 1 if bootstrap fails', async () => {
    process.chdir('./tests/feature/files/invalid')
    const exitCode = await runApp()

    expect(exitCode).to.be.eq(1)
    expect(
      stderrStub.withArgs(
        sinon.match('Not all command files could be bootstrapped'),
      ).calledOnce,
    ).to.be.true
  })
})
