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

> You should **not** ignore `package-lock.json`.

## Initialize

```bash
npm init # initialize npm repository with specifying the settings in interactive mode
npm init -y # initialize npm repository without specifying the settings (all by default)
```

## Dependencies

```bash
npm install # install (update) all the dependencies listed in `package.json` and fix the versions in `package-lock.json`
npm i # same

npm install <package> # install (update) a certain dependency and fix the version in `package-lock.json`
npm i <package> # same

npm i -g <package> # install a certain package globally (binaries will be available everywhere if present)
npm i -D <package> # install a certain package as "dev" dependency (will add the dependency to `devDependencies` section in `package.json`)

npm ci # restore all the dependencies from existing `package-lock.json`

npm uninstall <package> # uninstall the package
npm remove <package> # same
npm un <package> # same
npm uni <package> # same

npm uninstall -g <package> # uninstall the package globally (will delete the package from global scope but will not affect if locally installed)
```

## Scripts

> Scripts are aliases in `package.json` which can be used to build, test, lint project or do any other operations by performing a command-line described under the alias.

```json
{
  "scripts": {
    "build": "build-util",
    "test": "test-util",
    "start": "node app.js"
  }
}
```

```bash
npm run start # will perform `node app.js`
```

## Cache

> Cache is stored in `~/.npm` directory.

When a dependency is required to install it will be looked in cache first and will be copied from there if found.

```bash
npm cache verify # check for possible problems with cache
npm cache clean # clean cache totally (might be unavailable without --force option)
npm cache clean --force # clean cache totally
```

## Security

```bash
npm audit # check for possible security problems
npm audit fix # try to fix security problems without updating major versions of the dependencies
npm audit fix --force # fix security problems by updating the dependencies even if they have breaking changes
```

## `node_modules`

> Directory tree where the local dependencides are stored. The structure is flat even if the packages are actually nested:

```
node_modules/
  .bin/
  package1/
  package2/
  package3/
```

### `node_modules/.bin`

> Directory where the binaries for the local dependencies are stored. They can be used in `scripts` section of `package.json`:

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