#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const util = require('util')
const webdriverio = require('webdriverio')
const Launcher = webdriverio.Launcher

const execWrapper = require('../util/execWrapper')
const pathWrapper = require('../util/pathWrapper')
const ExtensionLoader = require('../lib/extension_loader')



const chromeExtensionPath = process.argv[2]
const webDriverIOConfigPath = process.argv[3]


const extensionDirectory = path.dirname(chromeExtensionPath)
const extensionName = pathWrapper.basename(chromeExtensionPath)

cleanConvertedExtensionFiles(extensionDirectory, extensionName)

const extensionLoader = new ExtensionLoader({
  chromeExtensionPath,
  execWrapper,
  pathWrapper
})

extensionLoader.load().then(base64CrxString => {
  const formattedBase64CrxString = removeReturnCharactersAndWhitespace(base64CrxString)
  const wdioConfig = require(path.resolve(webDriverIOConfigPath))

  getConfiguredWdioLauncher(wdioConfig, formattedBase64CrxString).run().then(function (code) {
    process.exit(code)
  }, function (error) {
    console.error('Launcher failed to start the test: ', error.stacktrace)
    process.exit(1)
  })
});


const removeReturnCharactersAndWhitespace = function (base64CrxString) {
  return base64CrxString.split('\n').map(s => s.trim()).join('')
}

const addChromeExtensionToBrowserCapabilities = function (capabilitiesWithExtension, formattedBase64CrxString) {
  capabilitiesWithExtension.chromeOptions = {
    extensions: [
      formattedBase64CrxString
    ]
  }

  return capabilitiesWithExtension
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