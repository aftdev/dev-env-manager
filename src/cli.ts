#!/usr/bin/env node

import runApp from '#src/index'

process.exitCode = await runApp()
