# @aftdev/dev-env-manager

## 4.0.0

### Major Changes

- [#193](https://github.com/aftdev/dev-env-manager/pull/193)
  [`5375792`](https://github.com/aftdev/dev-env-manager/commit/5375792be87caa1341203f5602170898682d4b8e)
  Thanks [@cgaube](https://github.com/cgaube)! - Upgrading major packages to the
  latest versions

- [#195](https://github.com/aftdev/dev-env-manager/pull/195)
  [`5a83fb1`](https://github.com/aftdev/dev-env-manager/commit/5a83fb1a177384651c78ccfcde59366ba7a3573e)
  Thanks [@cgaube](https://github.com/cgaube)! - Use consola instead of
  console.log

## 3.1.1

### Patch Changes

- [#191](https://github.com/aftdev/dev-env-manager/pull/191)
  [`864f584`](https://github.com/aftdev/dev-env-manager/commit/864f5845b77656a15085a7c68796e325b1aea25c)
  Thanks [@cgaube](https://github.com/cgaube)! - Updating node dependencies

## 3.1.0

### Minor Changes

- [#188](https://github.com/aftdev/dev-env-manager/pull/188)
  [`63b3073`](https://github.com/aftdev/dev-env-manager/commit/63b30737509a94d7e4a74242fe8f1b61e86885de)
  Thanks [@cgaube](https://github.com/cgaube)! - New way to execute commands via
  command class

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

### Patch Changes

- [#190](https://github.com/aftdev/dev-env-manager/pull/190)
  [`6a6c19d`](https://github.com/aftdev/dev-env-manager/commit/6a6c19d0b51b61bbf9fa92910c92be9d23ae3153)
  Thanks [@cgaube](https://github.com/cgaube)! - update c8 and commander
  dependencies

## 3.0.1

### Patch Changes

- [#172](https://github.com/aftdev/dev-env-manager/pull/172)
  [`e7ed553`](https://github.com/aftdev/dev-env-manager/commit/e7ed5530d5c871e61593cc1fe3299f77b8399e63)
  Thanks [@cgaube](https://github.com/cgaube)! - Adding more types to the
  declaration files

## 3.0.0

### Major Changes

- [#169](https://github.com/aftdev/dev-env-manager/pull/169)
  [`496f9d8`](https://github.com/aftdev/dev-env-manager/commit/496f9d8e87eb574be8f906d2ced657e8d2e00e0a)
  Thanks [@cgaube](https://github.com/cgaube)! - Improve typescript definition
  of the commands initializer

  Breaking change: The command initializers parameters are now using Awilix
  proxy method instead of the classic one

  This will help for type-hinting when users are creating their own initializers
  using typescript.

## 2.0.0

### Major Changes

- [#153](https://github.com/aftdev/dev-env-manager/pull/153)
  [`6613e9e`](https://github.com/aftdev/dev-env-manager/commit/6613e9e0b1f8cd00273e337e3845cb0b5097ebe7)
  Thanks [@cgaube](https://github.com/cgaube)! - We are now using typescript for
  all our files

### Patch Changes

- [`ea2b834`](https://github.com/aftdev/dev-env-manager/commit/ea2b83459d1531001398221bfba02930b82bc0b6)
  Thanks [@cgaube](https://github.com/cgaube)! - Test changeset release process

## [1.0.2](https://github.com/aftdev/dev-env-manager/compare/v1.0.1...v1.0.2) (2023-02-10)

### Bug Fixes

- **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1
  ([e246f02](https://github.com/aftdev/dev-env-manager/commit/e246f0209b012e4cf0a3c668972be3431be39484))

## [1.0.1](https://github.com/aftdev/dev-env-manager/compare/v1.0.0...v1.0.1) (2023-01-16)

### Bug Fixes

- **deps:** bump json5 from 1.0.1 to 1.0.2
  ([8902a82](https://github.com/aftdev/dev-env-manager/commit/8902a82d91ac9c5c76c19d505c93e9103075edd1))

## [1.0.0](https://github.com/aftdev/dev-env-manager/compare/v0.9.2...v1.0.0) (2023-01-16)

### ⚠ BREAKING CHANGES

- **deps:** new node version

### Miscellaneous Chores

- **deps:** update node version to 18
  ([4db05f6](https://github.com/aftdev/dev-env-manager/commit/4db05f6c8066537ea9c2118daaae931352017fe6))

### Continuous Integration

- add node 19 to matrix
  ([fa56647](https://github.com/aftdev/dev-env-manager/commit/fa56647ae5389f9caf15f5db9c5b2bb7d05eaef0))
- ignore node version on yarn install
  ([f9c03d4](https://github.com/aftdev/dev-env-manager/commit/f9c03d469a0a0fa532d244a0b03c290c069d9655))

## [0.9.2](https://github.com/aftdev/dev-env-manager/compare/v0.9.1...v0.9.2) (2022-10-16)

### Bug Fixes

- **deps:** bump awilix from 7.0.3 to 8.0.0
  ([#106](https://github.com/aftdev/dev-env-manager/issues/106))
  ([91b5d04](https://github.com/aftdev/dev-env-manager/commit/91b5d04b79f77771b4f492882d720b14fbbc8f23))

## [0.9.1](https://github.com/aftdev/dev-env-manager/compare/v0.9.0...v0.9.1) (2022-10-16)

### Bug Fixes

- **deps:** update dependencies
  ([#105](https://github.com/aftdev/dev-env-manager/issues/105))
  ([ed16e6e](https://github.com/aftdev/dev-env-manager/commit/ed16e6e458a0975783fe4aedd5fe61535ef3a1b8))

### Continuous Integration

- **dependabot:** 🚀 only update package.json if new version
  ([64ad7b3](https://github.com/aftdev/dev-env-manager/commit/64ad7b37b2231074264e681c5f6cfb2fb19c0980))

## [0.9.0](https://github.com/aftdev/dev-env-manager/compare/v0.8.4...v0.9.0) (2022-05-27)

### Features

- **enquirer:** use enquirer instead of inquirer
  ([c75abf5](https://github.com/aftdev/dev-env-manager/commit/c75abf5323e5cab85a51469d8cc5e40d35d98167))

### Bug Fixes

- **url:** get rid of useless node package
  ([e7f4d3a](https://github.com/aftdev/dev-env-manager/commit/e7f4d3acb04146465d11d422628520c44391fd12))

### Documentation

- mention enquirer in list of available services
  ([6d6eed8](https://github.com/aftdev/dev-env-manager/commit/6d6eed8f8771ffd4a8fe363341965b26f13d5628))

### [0.8.4](https://github.com/aftdev/dev-env-manager/compare/v0.8.3...v0.8.4) (2022-04-24)

### Bug Fixes

- **deps:** bump nconf from 0.11.3 to 0.12.0
  ([9b4a96d](https://github.com/aftdev/dev-env-manager/commit/9b4a96db38588d30477ae7781ed1a0c11dacc8af))

### [0.8.3](https://github.com/aftdev/dev-env-manager/compare/v0.8.2...v0.8.3) (2022-04-24)

### Bug Fixes

- **deps:** bump yaml from 1.10.2 to 2.0.1
  ([d0387c0](https://github.com/aftdev/dev-env-manager/commit/d0387c0e6343825e80ab70a935757b8099e82516))

### [0.8.2](https://github.com/aftdev/dev-env-manager/compare/v0.8.1...v0.8.2) (2022-04-02)

### Bug Fixes

- **deps:** bump awilix from 6.1.0 to 7.0.1
  ([56e1ec9](https://github.com/aftdev/dev-env-manager/commit/56e1ec93d21136c50b87ba83bf8a0d6043c28d30))

### [0.8.1](https://github.com/aftdev/dev-env-manager/compare/v0.8.0...v0.8.1) (2022-04-02)

### Bug Fixes

- **dep:** update dependencies
  ([d55c5be](https://github.com/aftdev/dev-env-manager/commit/d55c5beec82ebf83ec17abd4c13600abece4c73b))

## [0.8.0](https://github.com/aftdev/dev-env-manager/compare/v0.7.0...v0.8.0) (2022-04-01)

### Features

- **commander:** update to version 9
  ([d4995c6](https://github.com/aftdev/dev-env-manager/commit/d4995c652e92828ef72d3cf470cf7c4c680bb701))

### Continuous Integration

- **dependabot:** :rocket: update commit message format
  ([544dae2](https://github.com/aftdev/dev-env-manager/commit/544dae239d762498a663d8b36b756c0fa41b222e))
- **dependabot:** disable normal dependabot pr
  ([4b7d76a](https://github.com/aftdev/dev-env-manager/commit/4b7d76a6e1c8eda8ce942baa8e168cfc8f454b6f))

## [0.7.0](https://github.com/aftdev/dev-env-manager/compare/v0.6.0...v0.7.0) (2022-03-31)

### Features

- **setup:** improve setup commands
  ([fae0741](https://github.com/aftdev/dev-env-manager/commit/fae074121bec267b9d9676dae722c9f48477cf16))
- **vagrant:** add vagrant environment
  ([ed2d5aa](https://github.com/aftdev/dev-env-manager/commit/ed2d5aa567dd91eb23f6c3d32829bce407677d34))

### Code Refactoring

- **environments:** improve vagrant and docker services
  ([8dd72db](https://github.com/aftdev/dev-env-manager/commit/8dd72dbc0fad7f4801d90a3ec0d9ae777b0591c0))

## [0.6.0](https://github.com/aftdev/dev-env-manager/compare/v0.5.0...v0.6.0) (2022-03-18)

### Features

- **environments:** allow creation of custom environments
  ([dfe82df](https://github.com/aftdev/dev-env-manager/commit/dfe82df2442cce2e1621ac0872fec6fcc81e36dc))

### Documentation

- **commands:** fix commands doc and added examples
  ([5f5274f](https://github.com/aftdev/dev-env-manager/commit/5f5274fd3d19e6053877812aea000b8b0c2a3eaf))

## [0.5.0](https://github.com/aftdev/dev-env-manager/compare/v0.4.3...v0.5.0) (2022-03-13)

### Features

- exec catchall will only execute command if supported by one environment
  ([12346f0](https://github.com/aftdev/dev-env-manager/commit/12346f0e2060a65aab933bb80e1f225ecab59bf8))
- introducing environment manager
  ([2a6c359](https://github.com/aftdev/dev-env-manager/commit/2a6c359a74501adbf75890ee7e707fc9006fa986))
- **ssh:** automatically connect to target if only one
  ([e413d00](https://github.com/aftdev/dev-env-manager/commit/e413d002773cd63cbcef5934d4b3b5907aa9d975))

### Documentation

- update documentation
  ([10123f9](https://github.com/aftdev/dev-env-manager/commit/10123f9d9e72525fe6aa1cf5e2881cfcc04f11fd))

### [0.4.3](https://github.com/aftdev/dev-env-manager/compare/v0.4.2...v0.4.3) (2022-02-20)

### Bug Fixes

- **ci:** skip-ci on semantic-release
  ([b440211](https://github.com/aftdev/dev-env-manager/commit/b44021129c0f51ba0aa2be7c751ee7c366f12f94))
- move puka from devDependencies to dependencies
  ([d1e7f1a](https://github.com/aftdev/dev-env-manager/commit/d1e7f1adbbb62313b3729f633a23a0aec8857235))

### [0.4.2](https://github.com/aftdev/dev-env-manager/compare/v0.4.1...v0.4.2) (2022-02-20)

### Bug Fixes

- only include subset of files in npm package
  ([c17c4d5](https://github.com/aftdev/dev-env-manager/commit/c17c4d5a2db922ecc2dd8a698f25b46f9072b122))

### [0.4.1](https://github.com/aftdev/dev-env-manager/compare/v0.4.0...v0.4.1) (2022-02-18)

### Bug Fixes

- **ci:** fix ci pipeline to allow merging to main
  ([f9346bf](https://github.com/aftdev/dev-env-manager/commit/f9346bf368afac3e3962a150d6a3d8ea4fa73298))
- **ci:** fix ci pipeline to allow merging to main
  ([3152d67](https://github.com/aftdev/dev-env-manager/commit/3152d67293b449088df6fc2695acf6aa00af4524))
- update contributing doc
  ([27db33c](https://github.com/aftdev/dev-env-manager/commit/27db33c0a39c553c0ca6577f0b60bb4f45cd8297))

### Continuous Integration

- add automatic npm publish on push to main
  ([500e608](https://github.com/aftdev/dev-env-manager/commit/500e608c9be67fd9dd626ab332d84bde29651f35))
- **semantic-release:** use conventional commits for analyser
  ([522ca84](https://github.com/aftdev/dev-env-manager/commit/522ca84c751983561b8fb787854e33ed2466eaee))
