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

- create a branch and pull request `changeset-release/main` that will contain
  - package.json version bump
  - CHANGELOG addition
- when this pull request is merged back to `main` new packages will be published
  automatically.

In order to trigger a version bump and creation of this release branch your PR
needs to contain a `changeset` file

To do so use the command `yarn changeset add` and follow the instructions. It
will automatically create a commit for you that you can then push to your
branch.

Everything is done thanks to
[changesets](https://github.com/changesets/changesets) and it's
[github action](https://github.com/changesets/action)
