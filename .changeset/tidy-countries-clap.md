---
'@aftdev/dev-env-manager': minor
---

New way to execute commands via command class

```typescript
const command = commandExecuter.command('your-command')

// Display command and execute it - command output will be shown
command.execute()

// Execute command only - will display output but no show what command was executed
command.quiet().execute()

// Execute and return output (will not display the output)
const output = command.executeInBackground()

// Get json object from command output (Only works if command returns json compatible output)
const json = command.json()

// Get Array of lines from command output
const array = command.lines()
```
