export default {
  // Name of the command line utility.
  name: 'Command line utilities',
  // Where to find custom commands.
  commands_dir: null,
  // How and where to run your project executables.
  executables: {},
  // What files to use to autodiscover scripts.
  autodiscover: {
    'package.json': 'npm',
    'composer.json': 'composer',
  },
}
