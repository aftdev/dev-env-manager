export default {
  // Name of the command line utility
  name: 'Command line utilities',
  // Where to find custom commands
  commands_dir: null,
  // How and where to run your project executables
  executables: {},
  // List of all package managers and their configs
  package_managers: {
    // Node
    node: {
      // Which Node package manager to use (Npm / Yarn / Pnpm)
      manager: 'npm',
      // Auto discover scripts from these package manager files
      auto_discover: true,
      priority: 1,
    },
    // Php
    composer: {
      auto_discover: true,
      priority: 1,
    },
    // Ruby - TODO
  },
  // Docker compose
  'docker-compose': {
    config_file: 'docker-compose.yml',
  },
}
