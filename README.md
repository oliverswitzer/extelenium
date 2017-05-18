## A utility to make continuous testing of chrome extensions using Webdriver.io easy

**EXTERNAL DEPENDENCIES**: 
- Requires [crxmake](https://github.com/Constellation/crxmake) ruby gem to be installed globally
- [openssl binary](https://www.openssl.org/source/)

## To run integration tests with your chrome extension:

```
$ ./scripts/run_integration_tests_with_extension.js <PATH_TO_YOUR_CHROME_EXTENSION_DIRECTORY> <wdio.conf.js_PATH>
```

## Setup for local Development

```
$ npm install -g yarn
```

### Install dependencies:
```
$ yarn install
```

*For debugging the above command*

If you get an error that looks like this:

```
## There is an issue with `node-fibers` ##
`/Users/pivotal/workspace/web-driver-io-for-chrome-extensions/node_modules/fibers/bin/darwin-x64-51/fibers.node` is missing.

Try running this to fix the issue: /usr/local/Cellar/node/7.10.0/bin/node /Users/pivotal/workspace/web-driver-io-for-chrome-extensions/node_modules/fibers/build
ERROR: Couldn't initialise framework "wdio-jasmine-framework".
Error: Missing binary. See message above.
    at Object.<anonymous> (/Users/pivotal/workspace/web-driver-io-for-chrome-extensions/node_modules/fibers/fibers.js:20:8)
    at Module._compile (module.js:571:32)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
    at Module.require (module.js:498:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/Users/pivotal/workspace/web-driver-io-for-chrome-extensions/node_modules/fibers/future.js:2:13)
    at Module._compile (module.js:571:32)
```
Then try using node `v6.10.*`

---

Install *external* dependencies:

```
$ gem install crxmake
```

### Running tests:
```
$ yarn all-tests
```

To run unit tests or feature tests only:

```
$ yarn unit-tests
```

```
$ yarn feature-tests
```
