/**
 * Default configuration.
 */
export default {
  // Name of the command line utility
  name: 'Command line utilities',
  // Where to find custom commands
  commands_dirs: {},
  // Environment configurations.
  environments: {
    'docker-compose': {
      groups: {
        setup: true,
        connect: true,
        start: true,
      },
      options: {
        config_files: 'docker-compose.yml',
      },
    },
    vagrant: {
      groups: {
        setup: true,
        connect: true,
        start: true,
      },
    },
    local: {},
  },
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
}
