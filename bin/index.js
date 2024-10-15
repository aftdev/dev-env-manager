#!/usr/bin/env node

import runApp from '../dist/index.js'

process.on('SIGINT', () => {
  console.log('Received SIGINT.')
  // Should we exit here?
})

process.exitCode = await runApp()
