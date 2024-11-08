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
npm i # same as above

npm ci # install (restore) all the packages with their exact versions from the existing `package-lock.json`

npm install <packages> # install (or update) specific packages even if they're not listed in `package.json` and lock their updated versions in `package-lock.json` (will add new dependencies to the `dependencies` section in `package.json`)
npm i <packages> # same as above

npm i <package@version> # install (or upgrade/downgrade to) specific version of the package and lock its updated version in `package-lock.json` (will also add or update the dependency in `package.json` according to the exact updated version)

npm i -D <packages> # install (or update) specific packages as "dev" dependencies and lock their versions in `package-lock.json` (will add new dependencies to the `devDependencies` section in `package.json`)
npm i --save-dev <packages> # same as above

npm i -g <packages> # install (or update) specific packages globally (binaries will be available everywhere if present)
npm i --global <packages> # same as above

npm update # update (or install) all the packages listed in `package.json` up to their newest versions according to the version rules described in `package.json` and lock their updated versions in `package-lock.json`
npm upgrade # same as above
npm up # same as above

npm update <packages> # update (or install) specific packages if they're listed in `package.json` up to their newest versions according to the version rules described in `package.json` and lock their updated versions in `package-lock.json` 

npm uninstall <packages> # uninstall specific packages and lock the changes in `package-lock.json` (will remove listed dependencies from the `package.json`)
npm remove <packages> # same as above
npm un <packages> # same as above
npm uni <packages> # same as above

npm uninstall -g <packages> # uninstall specific packages globally (will delete the packages from the global scope but will not affect the local installation)
```

## `package.json`

```javascript
{
  "main": "index.js", // entrypoint for resolving dependencies if the project is used as a package
  "bin": "./index.js", // entrypoint to run if used as a bin (cli) utility
}
```

### Scripts

> Scripts are aliases in `package.json` that can be used to build, test, lint the project, or perform any other operations by running the command-line instructions described under the alias.

```javascript
{
  "scripts": {
    "build": "build-util",
    "test": "test-util",
    "start": "node app.js"
  }
}
```

```bash
npm run start # will execute `node app.js`
```

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

## Login

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

## `.npmignore`

> Files that should not be included in the registry when the project is published.
