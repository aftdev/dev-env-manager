# Contribution guide

## Installation for development

```bash
# Clone repo
$ git clone XXXX

# Use npm to symlink to your local folder
$ npm link
```

## Tests

```bash
$ yarn test-all

# With coverage
$ yarn coverage
```

## Commit messages

This project follows
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)

You can use `yarn commit` to help with formatting your messages.

## Linting

Linting should be done automatically when you add a commit thanks to
lint-staged.

You can manually check or fix your code by executing

```bash
$ yarn lint # Check for any linting issue.
$ yarn lint:fix # Use eslint to automatically fix your code (if possible).
$ yarn format # use prettier to automatically fix your code.
```
