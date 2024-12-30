# `npm` cheatsheet

## Prepare

`.gitignore`:

```
/node_modules
```

`.dockerignore`:

```
node_modules/
```

> **Make sure** you do **not** ignore `package-lock.json`.

## Initialize

```bash
npm init # initialize an npm repository with the settings specified in interactive mode
npm init -y # initialize an npm repository with default settings (will not ask anything)
```

## Dependencies

```bash
npm search <keywords> # search for packages by the provided keywords

npm install # install (or update) all the packages listed in `package.json` according to the version rules described in `package.json` and lock their updated versions in `package-lock.json`
npm i # same as `npm install`

npm ci # install (restore) all the packages with their exact versions from the existing `package-lock.json`

npm install <packages> # install (or update) specific packages even if they're not listed in `package.json` and lock their updated versions in `package-lock.json` (will add new dependencies to the `dependencies` section in `package.json`)
npm i <packages> # same as `npm install <packages>`

npm i <package@version> # install (or upgrade/downgrade to) specific version of the package and lock its updated version in `package-lock.json` (will also add or update the dependency in `package.json` according to the exact updated version)

npm i -D <packages> # install (or update) specific packages as "dev" dependencies and lock their versions in `package-lock.json` (will add new dependencies to the `devDependencies` section in `package.json`)
npm i --save-dev <packages> # same as `npm i -D <packages>`

npm i -g <packages> # install (or update) specific packages globally (binaries will be available everywhere if present)
npm i --global <packages> # same as `npm i -g <packages>`

npm list # print the list of the locally installed packages (dependencies)
npm ls # same as `npm list`
npm ls <package> # print the locally installed packages (dependencies) with the name `package`
npm ls --all # print the tree of the locally installed packages (dependencies)
npm ls -g # print the list of the globally installed packages (dependencies)

npm update # update (or install) all the packages listed in `package.json` up to their newest versions according to the version rules described in `package.json` and lock their updated versions in `package-lock.json`
npm upgrade # same as `npm update`
npm up # same as `npm update`

npm update <packages> # update (or install) specific packages if they're listed in `package.json` up to their newest versions according to the version rules described in `package.json` and lock their updated versions in `package-lock.json`

npm uninstall <packages> # uninstall specific packages and lock the changes in `package-lock.json` (will remove listed dependencies from the `package.json`)
npm remove <packages> # same as `npm uninstall <packages>`
npm un <packages> # same as `npm uninstall <packages>`
npm uni <packages> # same as `npm uninstall <packages>`

npm uninstall -g <packages> # uninstall specific packages globally (will delete the packages from the global scope but will not affect the local installation)
```

## `package.json`

### `main`

> The `main` field in `package.json` specifies the primary entry point of the package.

```javascript
{
  "name": "my-package",
  "main": "index.js"
}
```

In the example above, `index.js` will be loaded when the package is imported as a module (using `require('my-package')` or `import`), and its exports will be returned. If the `main` property is not set, it defaults to `index.js` in the package's root directory.

### `scripts`

> Scripts are aliases in `package.json` that can be used to build, test, lint the project, or perform any other operations by running the command-line instructions described under the alias.

```javascript
{
  "scripts": {
    "build": "build-util -t -a",
    "start": "node app.js",
    "custom:script": "custom-util --all --use-input=\"default\""
  }
}
```

Run:

```bash
npm run build # will execute `build-util -t -a`
npm run start -- --param="value" # pass positional arguments to the script; will execute `node app.js --param="value"`
npm run custom:script # any custom script is allowed; will execute `custom-util --all --use-input="default"`
```

#### Pre/Post scripts

> Scripts with the prefixes `pre` and `post` in the name, will be automatically executed when the matching script is called:

```javascript
{
  "scripts": {
    "prebuild": "build-util --prepare",
    "build": "build-util",
    "postbuild": "build-util --clear-cache"
  }
}
```

In the example above, `npm run build` will execute `prebuild`, `build` and `postbuild`.

#### Life cycle scripts

> There are several predefined script names that will be triggered on specific `npm` events. For example, the `prepare` script will be executed when calling `npm publish` and `npm pack` before those actions will be performed.

### `bin`

> Used to define CLI utilities for the package.

```javascript
{
  "name": "my-package",
  "bin": {
    "my-app": "./run.js",
    "additional-util": "./extra.js"
  }
}
```

Every executable script must start with the shebang `#!/usr/bin/env node` to indicate that it should be run with Node.js:

`run.js`:

```javascript
#!/usr/bin/env node

console.log('Hello from my-app!')
```

Install the package globally either from a local path or from the npm registry:

```bash
npm install -g . # from a local path
npm install -g my-package # from the npm registry
```

Once installed, the CLI tools can be executed directly from the command line:

```bash
my-app # executes `run.js`
additional-util # executes `extra.js`
```

If the package has only one executable, the definition can be simplified. The package name will automatically be used as the command name:

```javascript
{
  "name": "my-package",
  "bin": "./index.js"
}
```

Run:

```bash
my-package # executes `index.js`
```

## `npx`

Run a command from a local or remote npm package.

> `npx` and `npm exec` are mostly equivalent. The only difference is how they process the input arguments.

## Cache

> Cache is stored in the `~/.npm` directory, namely in `~/.npm/_cacache`.

When a dependency needs to be installed, it will be looked up in the cache first and will be copied from there if found.

```bash
npm cache verify # check for possible problems with the cache
npm cache clean # clean the cache completely (might be unavailable without the `--force` option)
npm cache clean --force # clean the cache completely
```

## Security

```bash
npm audit # check for possible security issues
npm audit fix # try to fix security issues without updating major versions of the dependencies
npm audit fix --force # fix security issues by updating the dependencies even if they have breaking changes
```

## Remote

### Working with profile

```bash
npm login # login to npm registry
npm whoami # print current username if logged in
npm who am i # same as above
npm profile get [property] # get profile parameter(s)
npm profile set <property> <value> # set profile parameter
npm team create <scope:team> # create a team
npm team destroy <scope:team> # remove a team
npm team add <scope:team> <username> # add a user to a team
npm team rm <scope:team> <username> # remove a user from a team
npm team ls <scope>|<scope:team> # print teams in a scope | users in a team
npm logout # logout from the registry
```

### Publishing packages

The `name` field in `package.json` is used to identify the package in the npm registry and must be globally unique in case of publishing:

```javascript
{
  "name": "my-package"
}
```

Useful commands / Workflow:

```bash
npm adduser # create a new npm account (if you don't have one yet)

npm login # log in to the npm registry (if you're not logged in yet)
npm whoami # display the current username (to verify you're logged in with the correct account)

npm pack # create a tarball archive of the package to make sure it contains everything you want and doesn't contain anything you don't want; use .npmignore to exclude undesired files and folders (`node_modules`, `.git` and some others are excluded by default)

npm install . -g # install the local package globally; ensure it installs and works as expected
npm ls -g # list globally installed packages to confirm it's installed

cd ../some-other-folder # go to the folder outside the package directory
npm install ../my-package  # install the local package locally; ensure it installs and works as expected
npm ls # list locally installed packages to confirm it's installed

npm publish # publish the package to the npm registry
npm unpublish # remove the package from the npm registry; consider using the `deprecate` command instead, if your intent is to encourage users to upgrade, or if you no longer want to maintain the package
```

### `.npmignore`

> Files that should not be included in the registry when the project is published.

## `node_modules`

> Directory tree where local dependencides are stored. The structure is flat even if the packages are actually nested:

```
node_modules/
  .bin/
  package1/
  package2/
  package3/
```

### `node_modules/.bin`

> Directory where the binaries for local dependencies are stored. They can be used in the `scripts` section of `package.json`:

```json
{
  "scripts": {
    "build": "some-binary"
  }
}
```

```bash
npm run build # will execute `./node_modules/.bin/some-binary` or `some-binary` if globally installed
```
