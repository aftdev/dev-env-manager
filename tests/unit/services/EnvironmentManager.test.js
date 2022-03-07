import { expect } from 'chai'
import { describe, it } from 'mocha'
import sinon from 'sinon'
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
        groups: {
          setup: false,
          connect: false,
          start: false,
        },
      },
      empty: {},
      connectOnly: {
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
})
