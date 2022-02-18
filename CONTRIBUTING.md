# Contribution guide

## Installation for development

```bash
# Clone repo
$ git clone git@github.com:aftdev/dev-env-manager.git

# Use npm to symlink to your local folder
$ cd dev-env-manager
$ npm link
```

## Tests

```bash
# Test all
$ yarn test-all

# With coverage
$ yarn coverage

# Test one file
$ yarn test path/to/file.js

# Test one function that match parameter in one file
$ yarn test path/to/file.js -g "test function description"

# Test functions that match parameter in all test files
$ yarn test path/to/file.js -g "test functions description"
```

## Commit messages

This project follows
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)

You will not be able to commit anything if your commit messages does not follow
the convention.

You could install
[commitizen](https://github.com/commitizen/cz-cli#using-the-command-line-tool)
to help you with message generation.

```bash
$ npm install -g commitizen
$ git cz
```

## Linting

Linting should be done automatically when you add a commit thanks to
lint-staged.

You can manually check or fix your code by executing

```bash
$ yarn lint # Check for any linting issue.
$ yarn lint:fix # Use eslint to automatically fix your code (if possible).
$ yarn format # use prettier to automatically fix your code.
```

# Release process

## Pull requests

Github actions are enabled on pull requests and you won't be able to merge if
any of them fail.

[See workflow here](.github/workflows/pull-request.yml)

## Npm package publication

Whenever commits are merged to the `main` branch, they will trigger the github
action workflow. [See file here](.github/workflows/release.yml)

This workflow will automatically:

- bump the version in the [`package.json`](./package.json) file
- create a git tag and github release for that version
- update the [`CHANGELOG.md`](./CHANGELOG.md) file
- publish the new version to the
  [NPM repository](https://www.npmjs.com/package/@aftdev/dev-env-manager)

We are using
[semantic-release](https://github.com/semantic-release/semantic-release) to do
that. Please read the
[How does it work](https://github.com/semantic-release/semantic-release#how-does-it-work)
section to learn more about the process.
