---
'@aftdev/dev-env-manager': major
---

Improve typescript definition of the commands initializer

Breaking change: The command initializers parameters are now using Awilix proxy
method instead of the classic one

This will help for type-hinting when users are creating their own initializers
using typescript.
