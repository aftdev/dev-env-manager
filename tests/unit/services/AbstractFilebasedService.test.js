import fs from 'fs'
import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import AbstractFilebasedService from '../../../src/services/AbstractFilebasedService.js'
import CommandExecuter from '../../../src/services/CommandExecuter.js'

describe('AbstractFilebasedService unit tests', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should properly check if enabled or not', () => {
    const fsStub = sandbox.stub(fs, 'existsSync')
    fsStub.returns(false)
    fsStub.withArgs(sinon.match('fileOk')).returns(true)
    fsStub.withArgs(AbstractFilebasedService.CONFIG_FILE).returns(true)

    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)

    let service

    service = new AbstractFilebasedService(commandExecuterStub)
    expect(service.isEnabled()).to.be.true

    const happyScenarios = ['fileOk1', ['fileOkA', 'fileOkB']]
    happyScenarios.forEach((files) => {
      service = new AbstractFilebasedService(commandExecuterStub, files)
      expect(service.isEnabled()).to.be.true
    })

    const unHappyScenarios = ['fileNotFound', ['fileNotFoundA', 'fileOk']]
    unHappyScenarios.forEach((files) => {
      service = new AbstractFilebasedService(commandExecuterStub, files)
      expect(service.isEnabled()).to.be.false
    })
  })

  it(`execute commands properly`, () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const filebasedService = new AbstractFilebasedService(commandExecuterStub)
    filebasedService.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(AbstractFilebasedService.COMMAND, [
        'test command',
      ]).callCount,
    ).to.be.eq(1)
  })

  it('should properly use custom config file when executing commands', () => {
    const commandExecuterStub = sandbox.createStubInstance(CommandExecuter)
    const filebasedService = new AbstractFilebasedService(commandExecuterStub, [
      'differentFile.json',
      'twoActually.json',
    ])
    filebasedService.execute(['test command'])

    expect(
      commandExecuterStub.execute.withArgs(AbstractFilebasedService.COMMAND, [
        { '-c': ['differentFile.json', 'twoActually.json'] },
        'test command',
      ]).callCount,
    ).to.be.eq(1)
  })
})
