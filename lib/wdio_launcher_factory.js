const path = require('path')
const _ = require('lodash')

const Launcher = require('webdriverio').Launcher

function WdioLauncherFactory(options) {
  this._wdioConfigFilePath = options.wdioConfigFilePath

  this.withExtensionLoaded = function withExtensionLoaded(options) {
    const encodedExtension = options.encodedExtension

    return new Launcher(this._wdioConfigFilePath, {
      capabilities: [
        this._addNewCapability({
          chromeOptions: {
            extensions: [encodedExtension]
          }
        })
      ]
    })
  }

  this._addNewCapability = function (newCapabilities) {
    const wdioConfig = require(path.resolve(this._wdioConfigFilePath))

    _.merge(wdioConfig.config.capabilities[0], newCapabilities)

    return wdioConfig.capabilities
  }

  this.withExtensionLoaded = this.withExtensionLoaded.bind(this)
}

module.exports = WdioLauncherFactory