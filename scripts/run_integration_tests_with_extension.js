#! /usr/bin/env node

const execWrapper = require('../util/execWrapper')
const pathWrapper = require('../util/pathWrapper')
const ExtensionLoader = require('../lib/extension_loader')

const fs = require('fs')
const path = require('path')
const util = require('util')
const webdriverio = require('webdriverio')
const Launcher = webdriverio.Launcher

const chromeExtensionPath = process.argv[2]
const webDriverIOConfigPath = process.argv[3]
const extensionName = pathWrapper.basename(chromeExtensionPath)
const extensionDirectory = path.dirname(chromeExtensionPath)

if (fs.existsSync(`${extensionDirectory}/${extensionName}.crx`)) {
  fs.unlinkSync(`${extensionDirectory}/${extensionName}.crx`)
}
if (fs.existsSync(`${extensionDirectory}/${extensionName}.pem`)) {
  fs.unlinkSync(`${extensionDirectory}/${extensionName}.pem`)
}

const extensionLoader = new ExtensionLoader({
  chromeExtensionPath,
  execWrapper,
  pathWrapper
})

extensionLoader.load().then((base64CrxString) => {
  const formattedBase64CrxString = base64CrxString.split('\n').map(s => s.trim()).join('')
  const wdioConfig = require(path.resolve(webDriverIOConfigPath))

  const capabilitiesWithExtension = wdioConfig.config.capabilities[0]
  capabilitiesWithExtension.chromeOptions =  {
    extensions: [
      formattedBase64CrxString
    ]
  }

  const wdioLauncher = new Launcher(path.resolve(webDriverIOConfigPath), {
    capabilities: [
      capabilitiesWithExtension
    ]
  })

  wdioLauncher.run().then(function (code) {
    process.exit(code)
  }, function (error) {
    console.error('Launcher failed to start the test: ', error.stacktrace)
    process.exit(1)
  })
});