import { createContainer } from 'awilix'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import sinon from 'sinon'
import Vagrant from '#src/services/Environment/Vagrant'
import EnvironmentManager from '#src/services/EnvironmentManager'

describe('Environment Manager Tests', () => {
  it('should return all environment that match criteria', () => {
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

    const envManager = new EnvironmentManager(
      {
        resolve: sinon.fake(),
      },
      config,
    )

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
    const envManager = new EnvironmentManager({ resolve: sinon.fake() }, {})

    expect(() => {
      envManager.get('myCustomEnv')
    }).to.throw('Unknown')
  })

  it('fails when environment is invalid', () => {
    const config = {
      env_name: {
        type: 'invalid env',
      },
    }
    const envManager = new EnvironmentManager({ resolve: sinon.fake() }, config)

    expect(() => {
      envManager.get('env_name')
    }).to.throw('Invalid')
  })

  it('allows creating/extending environments', () => {
    const config = {
      custom_env: {
        type: 'customType',
        options: ['a', 'b'],
      },
    }

    const container = createContainer()
    const envManager = new EnvironmentManager(container, config)

    envManager.extend('customType', (options) => ({ customEnv: true, options }))

    const environment = envManager.get('custom_env')
    expect(environment).to.eql({
      customEnv: true,
      options: config.custom_env.options,
    })
  })

  it('can create Vagrant env', () => {
    const config = {
      env_name: {
        type: 'vagrant',
      },
    }
    const envManager = new EnvironmentManager({ resolve: sinon.fake() }, config)

    const vagrant = envManager.get('env_name')
    expect(vagrant).to.be.instanceof(Vagrant)
  })
})
