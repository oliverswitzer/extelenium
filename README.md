# Extelenium
### A utility to make integration testing of chrome extensions using Webdriver.io easy

Do ever ask yourself questions like "do I have a purpose on this earth?" Or, "why am I writing a chrome extension?" or 
"how the hell am I supposed to test this thing?"

Try existentialenium! `extelenium` for short.


#### How it works:

Give it the directory to your chrome extension containing a `manifest.json`, and it will programmatically 
load it into a browser instance launched by [Webdriver.io](http://webdriver.io/). It is a useful tool if you want to run integration tests continually without having to do terrible 
things to your wdio.conf.js every time you make a change to your extension.


**EXTERNAL DEPENDENCIES**: 
- Requires [crxmake](https://github.com/Constellation/crxmake) ruby gem to be installed globally
- [openssl binary](https://www.openssl.org/source/) - already installed on Mac OSX

**PEER DEPENDENCIES**:
- [webdriverio](https://www.npmjs.com/package/webdriverio)

## Usage
**1)** Update your `package.json` to include extelenium as a devDependency and run `npm install`

**2)** [Install webdriverio](http://webdriver.io/guide/getstarted/install.html)

**3)** Specify the use of chrome for running your integration tests in your `wdio.conf.js` file:

```
exports.config = {
    ...
    capabilities: [{
        ...
        browserName: 'chrome'
        ...
    }]
}
```

**4)** Install a necessary external dependency:

```
$ gem install crxmake
```

(This is used for programmatically packaging your chrome extension into crx files)

**5)** Use provided script to run your integration tests with your extension loaded
```
$ ./node_modules/.bin/extelenium -e my-sample-extension/ -c wdio.conf.js
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
