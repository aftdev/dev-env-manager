import { expect } from 'chai'
import { ConsolaInstance } from 'consola'
import { beforeEach, afterEach, describe, it } from 'mocha'
import sinon, { SinonSandbox, SinonSpy } from 'sinon'
import OutputFormatter from '#services/OutputFormatter.js'
import consolaFactory from '#src/factories/consolaFactory'

describe('Outputformatter', () => {
  let sandbox: SinonSandbox
  let outputFormatter: OutputFormatter
  let consola: ConsolaInstance
  let consolaSpy: SinonSpy

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    consolaSpy = sinon.spy()
    consola = consolaFactory()
    consola.mockTypes(() => consolaSpy)

    outputFormatter = new OutputFormatter(consola)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it(`should log messages properly`, () => {
    outputFormatter.log('test')
    expect(consolaSpy.withArgs(sinon.match('test')).callCount).to.be.equal(1)
  })

  const data: Array<keyof Pick<OutputFormatter, 'title' | 'subtitle'>> = [
    'title',
    'subtitle',
  ]

  data.forEach((functionName) => {
    it(`should display ${functionName} messages properly`, () => {
      // Without box
      outputFormatter[functionName]('test')
      expect(consolaSpy.withArgs(sinon.match('test')).callCount).to.be.equal(1)
      expect(consolaSpy.withArgs(sinon.match('─────')).callCount).to.be.equal(1)

      // With box
      consolaSpy.resetHistory()
      outputFormatter[functionName]('test', { title: 'With box' })
      expect(
        consolaSpy.withArgs(sinon.match('With box')).callCount,
      ).to.be.equal(1)
      expect(consolaSpy.withArgs(sinon.match('test')).callCount).to.be.equal(1)
      expect(consolaSpy.withArgs(sinon.match('─────')).callCount).to.be.equal(1)

      // Custom color
      consolaSpy.resetHistory()
      outputFormatter[functionName]('test', {
        title: 'With box',
        color: 'green',
      })
      expect(consolaSpy.withArgs(sinon.match('test')).callCount).to.be.equal(1)
      expect(consolaSpy.withArgs(sinon.match('─────')).callCount).to.be.equal(1)
      expect(
        consolaSpy.withArgs(sinon.match('\x1B[32m')).callCount,
      ).to.be.equal(2)
    })
  })

  const styles: Array<
    keyof Pick<
      OutputFormatter,
      'success' | 'warning' | 'error' | 'info' | 'start'
    >
  > = ['success', 'warning', 'error', 'info']
  styles.forEach((style) => {
    it(`should properly display ${style} messages with / without custom titles`, () => {
      outputFormatter[style]('Custom Message')
      expect(
        consolaSpy.lastCall,
        'Should display line with custom title',
      ).to.match(/Custom Message/)

      outputFormatter[style]('with custom title', 'Custom Title')

      expect(consolaSpy.lastCall, 'Should display line with custom title')
        .to.match(/Custom Title/)
        .and.to.match(/with custom title/)
    })
  })

  it('show start log message', () => {
    outputFormatter.start('Start Message', 'Title')

    expect(consolaSpy.withArgs(sinon.match(/Title/)).callCount).to.be.equal(1)
    expect(
      consolaSpy.withArgs(sinon.match(/Start Message/)).callCount,
    ).to.be.equal(1)
    expect(consolaSpy.withArgs(sinon.match('─────')).callCount).to.be.equal(1)

    consolaSpy.resetHistory()
    outputFormatter.start('Start Message')
    expect(
      consolaSpy.withArgs(sinon.match(/Start Message/)).callCount,
    ).to.be.equal(1)
    expect(consolaSpy.withArgs(sinon.match('─────')).callCount).to.be.equal(1)
  })

  it('should display custom lines properly', () => {
    outputFormatter.log('This is my custom line', {
      color: 'green',
      title: 'Title',
    })

    expect(consolaSpy.lastCall, 'Should display line with custom title')
      .to.match(/Title/)
      .and.to.match(/This is my custom line/)

    outputFormatter.log('This is my custom line without title')
    expect(consolaSpy.lastCall, 'Should display line without title').to.match(
      /This is my custom line without title/,
    )
  })

  it('should display new lines', () => {
    outputFormatter.newLine().log('hello')
    expect(consolaSpy.firstCall.firstArg).to.equal('')
    expect(consolaSpy.secondCall.firstArg).to.match(/hello/)
  })
})
