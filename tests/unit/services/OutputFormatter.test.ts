import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonStubbedMember } from 'sinon'
import stripAnsi from 'strip-ansi'
import OutputFormatter from '#services/OutputFormatter.js'

describe('Outputformatter', () => {
  let sandbox: SinonSandbox
  let outputFormatter: OutputFormatter
  let outStub: SinonStubbedMember<typeof process.stdout.write>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    outStub = sandbox.stub(process.stdout, 'write')

    outputFormatter = new OutputFormatter()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`should output messages properly`, () => {
    outputFormatter.output('test')
    expect(outStub.withArgs(sinon.match('test')).callCount).to.be.equal(1)
  })

  const data: Array<[string & keyof OutputFormatter, string]> = [
    ['title', 'red'],
    ['subtitle', 'green'],
  ]

  data.forEach(([functionName, color]) => {
    it(`should display ${functionName} messages properly`, () => {
      outputFormatter[functionName]('test ', color)
      expect(outStub.withArgs(sinon.match('test')).callCount).to.be.equal(1)
    })
  })

  it('should properly display custom messages with / without custom titles', () => {
    const styles: Array<keyof OutputFormatter> = [
      'success',
      'warning',
      'error',
      'info',
    ]

    styles.forEach((style) => {
      outputFormatter[style]('Custom Message')
      expect(
        outStub.lastCall,
        'Should display line with custom title and icon',
      ).to.match(/Custom Message/)

      outputFormatter[style]('with custom title', 'Custom Title')

      expect(outStub.lastCall, 'Should display line with custom title and icon')
        .to.match(/Custom Title:/)
        .and.to.match(/with custom title/)
    })
  })

  it('should display custom lines properly', () => {
    outputFormatter.line('This is my custom line', 'green', 'Test', 'X')

    expect(outStub.lastCall, 'Should display line with custom title and icon')
      .to.match(/X Test:/)
      .and.to.match(/This is my custom line/)

    outputFormatter.line('This is my custom line without title or icon')

    expect(
      outStub.lastCall,
      'Should display line without title and icons',
    ).to.match(/This is my custom line without title or icon/)
  })

  it('should display new lines', () => {
    outputFormatter.newLine().output('hello')
    expect(outStub.firstCall.firstArg).to.equal('\n')
    expect(outStub.secondCall.firstArg).to.equal('hello\n')
  })

  it('should render error', () => {
    const errorString = 'Error String'
    outputFormatter.renderError(errorString)

    expect(outStub.lastCall)
      .to.match(/Error:/)
      .and.to.match(/Error String/)

    sandbox.restore()
    let messages: Array<string> = []
    outStub = sandbox
      .stub(process.stdout, 'write')
      .callsFake((str): boolean => {
        messages.push(str as string)
        return true
      })

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

  it('should return empty string if error is empty', () => {
    expect(outputFormatter.renderError('')).to.be.empty
  })
})
