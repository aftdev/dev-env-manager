import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon from 'sinon'
import stripAnsi from 'strip-ansi'
import OutputFormatter from '../../../src/services/OutputFormatter.js'

describe('Outputformatter', () => {
  let sandbox, mockBuffer, outputFormatter
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    mockBuffer = {
      write: sandbox.stub(),
    }
    outputFormatter = new OutputFormatter(mockBuffer)
  })

  afterEach(() => {
    sandbox.restore()
  })

  const data = [['output'], ['title', ['red']], ['subtitle', ['red']]]

  data.forEach(([functionName, otherParams = []]) => {
    it(`should display ${functionName} messages properly`, () => {
      outputFormatter[functionName]('test ', ...otherParams)
      expect(
        mockBuffer.write.withArgs(sinon.match('test')).callCount,
      ).to.be.equal(1)
    })
  })

  it('should properly display custom messages with / without custom titles', () => {
    const styles = ['success', 'warning', 'error', 'info']

    styles.forEach((style) => {
      outputFormatter[style]('Custom Message')
      expect(
        mockBuffer.write.lastCall,
        'Should display line with custom title and icon',
      ).to.match(/Custom Message/)

      outputFormatter[style]('with custom title', 'Custom Title')

      expect(
        mockBuffer.write.lastCall,
        'Should display line with custom title and icon',
      )
        .to.match(/Custom Title:/)
        .and.to.match(/with custom title/)
    })
  })

  it('should display custom lines properly', () => {
    outputFormatter.line('This is my custom line', 'green', 'Test', 'X')

    expect(
      mockBuffer.write.lastCall,
      'Should display line with custom title and icon',
    )
      .to.match(/X Test:/)
      .and.to.match(/This is my custom line/)

    outputFormatter.line('This is my custom line without title or icon')

    expect(
      mockBuffer.write.lastCall,
      'Should display line without title and icons',
    ).to.match(/This is my custom line without title or icon/)
  })

  it('should display new lines', () => {
    outputFormatter.newLine().output('hello')
    expect(mockBuffer.write.firstCall.firstArg).to.equal('\n')
    expect(mockBuffer.write.secondCall.firstArg).to.equal('hello\n')
  })

  it('should render error', () => {
    const errorString = 'Error String'
    outputFormatter.renderError(errorString)

    expect(mockBuffer.write.lastCall)
      .to.match(/Error:/)
      .and.to.match(/Error String/)

    let messages = []
    mockBuffer.write = (message) => {
      messages.push(message)
    }

    const error = new Error('First line')
    outputFormatter.renderError(error)

    let formattedMessage = stripAnsi(messages.join(''))
    expect(formattedMessage)
      .to.match(/Error: First line\n/)
      .to.match(/Stack:/)

    messages = []
    const multilineError = new Error('First line \n second line \n third line')
    outputFormatter.renderError(multilineError)

    formattedMessage = stripAnsi(messages.join(''))
    expect(formattedMessage)
      .to.match(/Error: First line\n/)
      .to.match(/\nsecond line/)
      .to.match(/Stack:/)
  })
})
