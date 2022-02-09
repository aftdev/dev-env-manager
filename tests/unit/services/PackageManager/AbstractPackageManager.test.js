import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import CommandExecuter from '../../../../src/services/CommandExecuter.js'
import AbstractPackageManager from '../../../../src/services/PackageManager/AbstractPackageManager.js'

describe('AbstractPackageManager unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should properly execute install process', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const manager = new AbstractPackageManager(commandExecuterStub)

    manager.install()

    expect(
      commandExecuterStub.execute.withArgs(AbstractPackageManager.COMMAND, [
        'install',
      ]).callCount,
    ).to.be.eq(1)
  })

  it('should properly handle scripts', () => {
    const fsStub = sandbox.stub(fs, 'readFileSync')
    fsStub.returns(`{
      "scripts": {
        "scriptA": "scriptA",
        "scriptB": "scriptB"
      }
    }`)

    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const manager = new AbstractPackageManager(commandExecuterStub)

    expect(manager.getScripts()).to.have.lengthOf(2)
    expect(manager.hasScript('scriptA')).to.be.true
    expect(manager.hasScript('unknown')).to.be.false

    manager.executeScript('scriptB', ['a', 'b', 'c'])
    expect(
      commandExecuterStub.execute.withArgs(AbstractPackageManager.COMMAND, [
        'scriptB',
        'a',
        'b',
        'c',
      ]).callCount,
    ).to.be.eq(1)
  })
})
