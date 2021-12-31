export default (cli, outputFormatter, dockerCompose, composer, npm) => {
  // Don"t add function if it has been defined by the current project.
  if (!cli._findCommand('setup')) {
    cli
      .command('setup')
      .description('Initial setup')
      .action(() => {
        outputFormatter.title('Project Setup')

        // Docker compose
        if (dockerCompose.isEnabled()) {
          dockerCompose.execute(['build'])
          dockerCompose.execute(['up', '-d'])
        }

        // Composer
        if (composer.isEnabled()) {
          composer.execute(['install'])
        }

        // packages.json (npm / yarn / pnpm)
        if (npm.isEnabled()) {
          npm.execute(['install'])
        }
      })
  }
}
