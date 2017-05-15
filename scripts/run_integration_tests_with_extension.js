#! /usr/bin/env node

const path = require('path')
const Launcher = require('webdriverio').Launcher

const ExtensionConverter = require('../lib/extension_converter')
const WdioLauncherFactory = require('../lib/wdio_launcher_factory')

const chromeExtensionPath = process.argv[2]
const wdioConfigFilePath = path.resolve(process.argv[3])

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