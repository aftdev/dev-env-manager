#!/usr/bin/env node

import runApp from '../src/index.js'

process.exitCode = await runApp()
