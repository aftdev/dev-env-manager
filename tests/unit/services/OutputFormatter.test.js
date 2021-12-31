import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import OutputFormatter from '../../../src/services/OutputFormatter.js'

describe('Outputformatter', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  const data = [
    ['output'],
    ['title', 'red'],
    ['subtitle', 'red'],
    ['success'],
    ['warning'],
    ['error'],
  ]

  data.forEach(([functionName, color = null]) => {
    it(`should display ${functionName} messages properly`, () => {
      const mockBuffer = {
        write: sandbox.stub(),
      }
      const outputFormatter = new OutputFormatter(mockBuffer)

      outputFormatter[functionName]('test ', color)
      expect(
        mockBuffer.write.withArgs(sinon.match('test')).callCount,
      ).to.be.equal(1)
    })
  })
})
