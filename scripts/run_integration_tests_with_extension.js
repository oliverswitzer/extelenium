#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const util = require('util')
const webdriverio = require('webdriverio')
const Launcher = webdriverio.Launcher

const execWrapper = require('../util/execWrapper')
const pathWrapper = require('../util/pathWrapper')
const ExtensionConverter = require('../lib/extension_converter')


const chromeExtensionPath = process.argv[2]
const webDriverIOConfigPath = process.argv[3]

const extensionDirectory = path.dirname(chromeExtensionPath)
const extensionName = pathWrapper.basename(chromeExtensionPath)

cleanConvertedExtensionFiles(extensionDirectory, extensionName)

const extensionConverter = new ExtensionConverter({
  chromeExtensionPath,
  execWrapper,
  pathWrapper
})

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