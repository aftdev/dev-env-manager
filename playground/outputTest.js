/**
 * Show all output styles.
 */
export default ({ cli, outputFormatter }) => {
  cli
    .command('output')
    .description('Test all output styles')
    .action(() => {
      outputFormatter.title('Test all output styles', {
        title: 'Output',
      })
      outputFormatter.subtitle('Sub title')

      outputFormatter.success('Success Message')
      outputFormatter.info('Info Message')
      outputFormatter.warning('Warning Message')
      outputFormatter.error('Error Message')
      outputFormatter.debug('Debug Message')
      outputFormatter.start('Start message', 'mooh')

      outputFormatter.separator()

      outputFormatter.success('Success Message', 'Title')
      outputFormatter.info('Info Message', 'Title')
      outputFormatter.warning('Warning Message', 'Title')
      outputFormatter.error('Error Message', 'Title')
      outputFormatter.debug('Debug Message', 'Title')
    })
}
