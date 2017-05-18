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

Install dependencies:
```
$ yarn install
```

Install external dependencies:

```
$ gem install crxmake
```

Run the tests:
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
