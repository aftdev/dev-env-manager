import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStubbedInstance } from 'sinon'
import EnvManager from '#services/EnvironmentManager'
import Npm from '#services/PackageManager/Npm'
import Pnpm from '#services/PackageManager/Pnpm'
import Yarn from '#services/PackageManager/Yarn'

describe('Node Package Managers unit tests', () => {
  let sandbox: SinonSandbox
  let envManagerStub: SinonStubbedInstance<EnvManager>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    envManagerStub = sandbox.createStubInstance(EnvManager)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('npm', () => {
    it(`execute npm commands properly`, () => {
      const packageManager = new Npm(envManagerStub)
      packageManager.execute(['test command'])

      expect(
        envManagerStub.executeCommand.withArgs('npm', ['test command'])
          .callCount,
      ).to.be.eq(1)
    })

    it('should properly execute install process', () => {
      const packageManager = new Npm(envManagerStub)
      packageManager.install()

      expect(
        envManagerStub.executeCommand.withArgs('npm', ['install']).callCount,
      ).to.be.eq(1)
    })

    it(`should execute script`, () => {
      const packageManager = new Npm(envManagerStub)
      packageManager.executeScript('script')

      expect(
        envManagerStub.executeCommand.withArgs('npm', ['run', 'script'])
          .callCount,
      ).to.be.eq(1)
    })
  })

  describe('yarn', () => {
    it(`executes yarn commands properly`, () => {
      const packageManager = new Yarn(envManagerStub)
      packageManager.execute(['test command'])

      expect(
        envManagerStub.executeCommand.withArgs('yarn', ['test command'])
          .callCount,
      ).to.be.eq(1)
    })

    it('should properly execute install process', () => {
      const packageManager = new Yarn(envManagerStub)
      packageManager.install()

      expect(
        envManagerStub.executeCommand.withArgs('yarn', ['install']).callCount,
      ).to.be.eq(1)
    })

    it(`executes scripts`, () => {
      const packageManager = new Yarn(envManagerStub)
      packageManager.executeScript('script')

      expect(
        envManagerStub.executeCommand.withArgs('yarn', ['run', 'script'])
          .callCount,
      ).to.be.eq(1)
    })
  })

  describe('pnpm', () => {
    it(`executes Pnpm commands properly`, () => {
      const packageManager = new Pnpm(envManagerStub)
      packageManager.execute(['test command'])

      expect(
        envManagerStub.executeCommand.withArgs('pnpm', ['test command'])
          .callCount,
      ).to.be.eq(1)
    })

    it('should properly execute install process', () => {
      const packageManager = new Pnpm(envManagerStub)
      packageManager.install()

      expect(
        envManagerStub.executeCommand.withArgs('pnpm', ['install']).callCount,
      ).to.be.eq(1)
    })

    it(`executes scripts`, () => {
      const packageManager = new Pnpm(envManagerStub)
      packageManager.executeScript('script')

      expect(
        envManagerStub.executeCommand.withArgs('pnpm', ['run', 'script'])
          .callCount,
      ).to.be.eq(1)
    })
  })
})
