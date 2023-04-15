#!/usr/bin/env node

import runApp from '../dist/index.js'

process.exitCode = await runApp()
