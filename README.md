# Dev environment command line utilities.

A command line utility application build with [commander](https://github.com/tj/commander.js) that
provides developers goodies/shortcuts to manage their environments.

It allows you to specify where the scripts need to be executed (locally, on docker?) For example if
you want all your composer scripts to be executed on a specific docker container

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

## Commands

### Init

Generate the dev-config.yml file where all project config are places

### Connect / SSH

Use your docker-compose.yml file to return list of running container just select one to ssh to it.

```bash
$ dev connect

Select what container to connect to
- app1
- app2
- app3
- mysql
- redis
```

Ssh to one container directly

```bash
$ dev connect app1
```

Ssh as root

```bash
$ dev connect app1 --root
```

### Setup

```bash
$ dev setup
```

Execute the commands defined in your configuration file. This can be useful for new people working
on your project. They would just have to execute the command install it.

example of setup commands

- docker compose build
- composer install
- yarn install
- copy .env-example to .env

By default the command will setup a few things depending on what file it finds For e.g if your
project has a docker-compose file it will do docker compose build then docker compose up If the
project as a composer.json file it will do composer install.

### Start - Down

Start and stop containers. Basically a shortcut for docker-compose down

### composer

### Yarn / NPM

### Scripts Auto discovery

Sometimes typing `dev composer script-name` can be repetitive. This is why this application will
autodiscover the scripts from composer.json or package.json for you

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
    "build": "yarn build --X --y",
    "test": "node --unhandled-rejections=strict node_modules/.bin/jest",
  ...
}
```

```bash
$ dev other-script # will do dev composer other-script
$ dev build # will do dev yarn build
```

To enable this feature add in your `dev-config.yml` file

```yaml
autodiscover:
  './package.json': 'yarn'
  './composer.json': 'composer'
```

If the same script exists in both file, the command from the first file will be used (in our example
the package.json script will be used)

```json
$ dev test
```

Also, commands registered at the application level (via commander) will always take priority over
those `scripts` commands. So if you created a custom `build` command it will always use that command
and not yarn build

## Per Project Custom Commands

Each project you own can hook their own commands. You just need to set your command folder in the
dev-config.yml and add some command files in there.

The project commands will always take precedence over this application default commands

`./dev-config.yml`

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

**Note**: please use extension .mjs if your project package.json is setup as type:"module"

## Configuration

```yaml
# Where to find the project custom commands.
commands_dir: null
# Auto discover scripts from
autodiscover:
  './package.json': 'yarn'
  './composer.json': 'composer'
# How and where to run your project executables
executables:
  docker-compose: docker compose
  npm: yarn
  composer:
    command: composer
    # Where should the command be executed?
    use:
      target: docker-compose
      with: ['exec', 'php']
```
