#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const util = require('util')
const webdriverio = require('webdriverio')
const Launcher = webdriverio.Launcher

const ExtensionConverter = require('../lib/extension_converter')

const chromeExtensionPath = process.argv[2]
const webDriverIOConfigPath = process.argv[3]

const extensionDirectory = path.dirname(chromeExtensionPath)
const extensionName = path.basename(chromeExtensionPath)

cleanConvertedExtensionFiles(extensionDirectory, extensionName)

const extensionConverter = new ExtensionConverter({chromeExtensionPath})

extensionConverter
  .toCrxFile()
  .then(extensionConverter.toBase64String)
  .then(convertedExtension => {
    const wdioConfig = require(path.resolve(webDriverIOConfigPath))

    getConfiguredWdioLauncher(wdioConfig, convertedExtension).run().then(code => {
      process.exit(code)
    }, (error) => {
      console.error('Launcher failed to start the test: ', error.stacktrace)
      process.exit(1)
    })
  })
  .then(extensionConverter.cleanCrxAndPemFiles)

const addChromeExtensionToBrowserCapabilities = function (existingCapabilities, formattedBase64CrxString) {
  return existingCapabilities.chromeOptions = {
    extensions: [
      formattedBase64CrxString
    ]
  }
}

const existingCapabilities = function (wdioConfig) {
  return wdioConfig.config.capabilities[0]
}

const getConfiguredWdioLauncher = function (wdioConfig, formattedBase64CrxString) {
  return new Launcher(path.resolve(webDriverIOConfigPath), {
    capabilities: [
      addChromeExtensionToBrowserCapabilities(existingCapabilities(wdioConfig), formattedBase64CrxString)
    ]
  })
}

function cleanConvertedExtensionFiles(extensionDirectory, extensionName) {
  if (fs.existsSync(`${extensionDirectory}/${extensionName}.crx`)) {
    fs.unlinkSync(`${extensionDirectory}/${extensionName}.crx`)
  }
  if (fs.existsSync(`${extensionDirectory}/${extensionName}.pem`)) {
    fs.unlinkSync(`${extensionDirectory}/${extensionName}.pem`)
  }
}