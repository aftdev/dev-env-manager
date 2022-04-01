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