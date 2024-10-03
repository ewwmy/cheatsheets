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
npm search <keyword> # look for the packages by the provided keyword
npm search <keyword1> [keyword2] ... # look for the packages by the provided keywords

npm install # install (update) all dependencies listed in `package.json` and lock their versions in `package-lock.json`
npm i # same

npm ci # restore all the dependencies from the existing `package-lock.json`

npm install <package> # install (update) a specific dependency and lock its version in `package-lock.json`
npm i <package> # same

npm i <package1> [package2] ... # install multiple packages

npm i -g <package> # install a specific package globally (binaries will be available everywhere if present)
npm - --global <package> # same

npm i -D <package> # install a specific package as a "dev" dependency (will add the dependency to the `devDependencies` section in `package.json`)
npm i --save-dev <package> # same

npm uninstall <package> # uninstall the package
npm remove <package> # same
npm un <package> # same
npm uni <package> # same

npm uninstall <package1> [package2] ... # uninstall multiple packages

npm uninstall -g <package> # uninstall the package globally (will delete the package from the global scope but will not affect the local installation)
```

## Scripts

> Scripts are aliases in `package.json` that can be used to build, test, lint the project, or perform any other operations by running the command-line instructions described under the alias.

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
