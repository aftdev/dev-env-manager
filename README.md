# Dev environment Manager - command line utilities.

A command line application build with [commander](https://github.com/tj/commander.js) that provides
developers goodies/shortcuts to manage their development environments.

The main goal of this application is to give you shortcuts for your most utilized commands and to
define where those commands should be executed (locally or on a docker container?)

For example if you want all your composer (php) scripts to be executed on a specific docker
container.

```yaml
executables:
  composer:
    use:
      target: docker-compose
      with: ['exec', '[container_name]']
```

```bash
dev composer install
```

will execute

```bash
docker composer exec [container_name] composer install
```

It also gives you access to common commands to help with day to day activities and allows you to
define custom commands very easily. (via the [commands_dir](#configuration) configuration)

## Installation

```bash
$ npm install -g "@aftdev/dev-env-manager"
```

This will gives you global access to the "dev" executable.

```
$ dev --help
```

**Note:** `dev` might be already in use by your system or any other npm packages - And we might have
change this bin name without notices if we discover such conflict. Ideally we would want to come up
with a better name.

## Default Commands

### Init

Generate the `dev-env-config.yml` file where [configuration](#configuration) can be edited.

### Connect / SSH

Use your docker-compose.yml file to return list of running containers, just select one to ssh to it.

```bash
$ dev connect

Select what container to connect to
- app1
- app2
- app3
- mysql
- redis

# Ssh to one container directly
$ dev connect app1

# Ssh as root
$ dev connect app1 --root
```

### Setup

```bash
$ dev setup
```

Setup the environment. Useful when someone just cloned the project and want to get started quickly.

This command will execute

- docker compose build (if a docker-compose.yml file is found)
- docker compose up -d
- composer install (if a composer.json exists)
- npm install (if a docker-compose.yml file is found)

### Start - Down

Start and stop containers. Basically a shortcut for docker-compose up/down

### Scripts Auto discovery

Sometimes typing `dev composer script-name` can be repetitive. This is why this application will
autodiscover the scripts from the composer.json or package.json files for you.

`composer.json`

```json
{
  ...
  "scripts": {
    "test": "phpunit",
    "other-script": "do something else"
  },
  ...
}
```

`package.json`

```json
{
  ...
  "scripts": {
    "build": "yarn build",
    "test": "mocha",
  ...
}
```

```bash
$ dev other-script # will execute `dev composer other-script`
$ dev build # will execute `dev yarn build`
```

To enable this feature add in your `dev-env-config.yml` file

```yaml
autodiscover:
  'package.json': 'yarn'
  'composer.json': 'composer'
```

**Note:** If the same script exists in both file, the command from the first file will be used (in
our example the package.json script will be used)

```json
$ dev test
```

Also, commands registered at the application level (via commander) will always take priority over
those `scripts` commands. So if you created a custom `build` command it will always use that command
and not yarn build

## Custom Commands

Each project you own can hook their own commands. You just need to set your command folder in the
dev-env-config.yml and add some command files in there.

The project commands will always take precedence over this application default commands

`./dev-env-config.yml`

```yaml
commands_dir: ./commands
```

`./commands/mycool-command.js`

```js
export default (cli) => {
  cli
    .command('your-command-name')
    .description('This is my really cool command')
    .action(() => {
      console.log('HELLO')
    })
}
```

**Note**: If you want to use a npm package from your project they will need to be added to that
project package.json

**Important**: please use extension **.mjs** if your project package.json is not setup as
type:"module" (or you dont have a package.json file)

### Services that can be used by your commands

- `dockerCompose` : execute command on a container
- `composer`: execute composer commands
- `npm`: execute npm commands
- `outputFormatter`: helpers to style output
- `commandExecuter`: execute commands

Those services are automatically injected in your command "module"

```js
export default (cli, dockerCompose, outputFormatter, composer) => {
  cli.command('auto-injection').action(() => {
    outputFormatter.title('Auto Injection example')

    const containers = dockerCompose.getContainers()
    console.log(containers)

    composer.execute(['install'])
  })
}
```

## Configuration

```yaml
# Where to find the project custom commands. (.js/.cjs/.mjs)
commands_dir: null
# Auto discover scripts from
autodiscover:
  # package manager file: command to use to execute its scripts
  'package.json': 'yarn'
  'composer.json': 'composer'
# How and where to run your project executables
executables:
  # simple format
  docker-compose: docker compose
  npm: yarn
  # With Target
  composer:
    # Where should the command be executed?
    use:
      target: docker-compose
      with: ['exec', 'php']
```
