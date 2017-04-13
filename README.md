### A project template with a script that allows you to feature test your chrome plugin using webdriverio

**EXTERNAL DEPENDENCIES**: 
- Requires [crxmake](https://github.com/Constellation/crxmake) ruby gem to be installed globally
- openssl binary on OSX

## Example usage:
```
$ ./scripts/generate-wdio-config-with-extension.js <FULL_PATH_TO_CHROME_EXTENSION_DIRECTORY> <FULL_PATH_TO_WDIO_CONF_JS_FILE>
```

Then run your tests as you would with webdriverio, using the generated wdio-with-extension.conf.json file:

```
$ ./node_modules/.bin/wdio wdio-with-extension.conf.json
```
