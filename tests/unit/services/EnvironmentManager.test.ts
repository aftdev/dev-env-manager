import { createContainer } from 'awilix'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import sinon from 'sinon'
import type CommandExecuter from '#services/CommandExecuter.js'
import AbstractEnvironment from '#services/Environment/AbstractEnvironment.js'
import Vagrant from '#services/Environment/Vagrant.js'
import EnvironmentManager from '#services/EnvironmentManager.js'

describe('Environment Manager Tests', () => {
  const stubContainer = () => {
    const container = createContainer()

    sinon.stub(container, 'resolve').withArgs('commandExecuter').returns(true)

    return container
  }

  it('should return all environments that match criteria', () => {
    const config = {
      env1: {
        type: 'dockerCompose',
        groups: {
          setup: true,
          connect: true,
          start: true,
        },
      },
      never: {
        type: 'local',
        groups: {
          setup: false,
          connect: false,
          start: false,
        },
      },
      empty: { type: 'local' },
      connectOnly: {
        type: 'local',
        groups: {
          connect: true,
        },
      },
    }

    const container = stubContainer()
    const envManager = new EnvironmentManager(container, config)

    const envThatCanBeSetup = envManager.groupedBy({ setup: true })
    expect(envThatCanBeSetup).to.have.all.keys(['env1'])

    const envWithConnectOption = envManager.groupedBy({ connect: true })
    expect(envWithConnectOption).to.have.all.keys(['env1', 'connectOnly'])

    const envMatchingSeveralCriteria = envManager.groupedBy({
      connect: true,
      setup: true,
    })
    expect(envMatchingSeveralCriteria).to.have.all.keys(['env1'])

    const unknownCriteria = envManager.groupedBy({ what: true })
    expect(unknownCriteria).to.be.empty
  })

  it('fails when environment does not exist', () => {
    const container = stubContainer()
    const envManager = new EnvironmentManager(container, {})

    expect(() => {
      envManager.get('myCustomEnv')
    }).to.throw('Cannot build env [myCustomEnv]: Unknown')
  })

  it('fails when environment is invalid', () => {
    const container = stubContainer()
    const config = {
      env_name: {
        type: 'invalid env',
      },
    }
    const envManager = new EnvironmentManager(container, config)

    expect(() => {
      envManager.get('env_name')
    }).to.throw('Invalid')
  })

  it('allows creating/extending environments', () => {
    const config = {
      custom_env: {
        type: 'customType',
        options: {
          a: 'A',
          b: 'B',
        },
      },
    }

    const container = stubContainer()
    const envManager = new EnvironmentManager(container, config)

    envManager.extend(
      'customType',
      (options) =>
        new (class extends AbstractEnvironment {
          constructor(
            commandExecuter: CommandExecuter,
            public options: unknown,
          ) {
            super(commandExecuter)
          }

          override execute(_command: unknown, _options: unknown): void {}

          override setup(): void {}
          override start(): void {}
          override stop(): void {}
          override status(): void {}
          override connect(): void {}
        })({} as CommandExecuter, options),
    )

    const environment = envManager.get('custom_env')
    expect(environment).to.have.property('options', config.custom_env.options)
  })

  it('can create Vagrant env', () => {
    const container = stubContainer()
    const config = {
      env_name: {
        type: 'vagrant',
      },
    }
    const envManager = new EnvironmentManager(container, config)

    const vagrant = envManager.get('env_name')
    expect(vagrant).to.be.instanceof(Vagrant)
  })

  describe('canExecuteCommand', () => {
    it('returns the right value', () => {
      const config = {
        env1: {
          type: 'local',
          commands: {
            command1: { option: 'a' },
          },
        },
        env: {
          type: 'local',
        },
      }

      const container = stubContainer()
      const envManager = new EnvironmentManager(container, config)

      expect(envManager.canExecuteCommand('command1')).to.be.true

      expect(envManager.canExecuteCommand('non existent')).to.be.false
    })
  })
})
