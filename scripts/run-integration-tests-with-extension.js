#! /usr/bin/env node

const fs = require('fs')
const exec = require('child_process').exec
const base64 = require('base-64')
const path = require('path')
const util = require('util')
const webdriverio = require('webdriverio')
const Launcher = webdriverio.Launcher

const extensionFullPath = process.argv[2]
const webDriverIOConfigPath = process.argv[3]
const extensionName = path.basename(extensionFullPath)
const extensionDirectory = path.dirname(extensionFullPath)

if (fs.existsSync(`${extensionDirectory}/${extensionName}.crx`)) {
  fs.unlinkSync(`${extensionDirectory}/${extensionName}.crx`)
}
if (fs.existsSync(`${extensionDirectory}/${extensionName}.pem`)) {
  fs.unlinkSync(`${extensionDirectory}/${extensionName}.pem`)
}

exec(`crxmake --pack-extension="${extensionFullPath}" --extension-output="${extensionDirectory}/${extensionName}.crx"`, (err, stdout) => {
  exec(`openssl base64 -in ${extensionDirectory}/${extensionName}.crx`, (err, stdout) => {
    const base64CrxFile = stdout.split('\n').map(s => s.trim()).join('')
    const wdioConfig = require(path.resolve(webDriverIOConfigPath))

    const capabilitiesWithExtension = wdioConfig.config.capabilities[0]
    capabilitiesWithExtension.chromeOptions =  {
      extensions: [
        base64CrxFile
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
  })
})