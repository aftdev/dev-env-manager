/**
 * Show all output styles.
 */
export default (cli, outputFormatter) => {
  cli
    .command('output')
    .description('Test all output styles')
    .action(() => {
      outputFormatter.title('Test all output styles')
      outputFormatter.subtitle('Sub title')
      outputFormatter.output('')
      outputFormatter.success('Success Message')
      outputFormatter.info('Info Message')
      outputFormatter.warning('Warning Message')
      outputFormatter.error('Error Message')
      outputFormatter.separator()
      outputFormatter
        .line('Test Message', 'white', 'Title', outputFormatter.icons.dash)
        .newLine()
        .line('Test Message')

      outputFormatter.separator()
      outputFormatter.renderError(
        new Error('Test Error  \n second line \n test'),
      )
    })
}
