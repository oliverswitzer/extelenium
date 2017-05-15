#! /usr/bin/env node

const path = require('path')
const argv = require('yargs').usage(`
Example Usage:
 
run_integration_tests_with_extension -c wdio.conf.js -e extension-directory/
run_integration_tests_with_extension --config wdio.conf.js --extension extension-directory/`
).argv;

const Launcher = require('webdriverio').Launcher
const ExtensionConverter = require('../lib/extension_converter')
const WdioLauncherFactory = require('../lib/wdio_launcher_factory')

const chromeExtensionPath = argv.extension || argv.e
const wdioConfigFilePath = path.resolve(argv.config) || path.resolve(argv.c)

const extensionConverter = new ExtensionConverter({chromeExtensionPath})
const wdioLauncherFactory = new WdioLauncherFactory({wdioConfigFilePath})

extensionConverter
  .toCrxFile()
  .then(extensionConverter.toBase64String)
  .then(convertedExtension => {
    const launcher = wdioLauncherFactory.withExtensionLoaded({
      encodedExtension: convertedExtension
    })

    launcher.run().then(code => {
      process.exit(code)
    }, (error) => {
      console.error('Launcher failed to start the test: ', error.stacktrace)
      process.exit(1)
    })
  })
  .then(extensionConverter.cleanCrxAndPemFiles)