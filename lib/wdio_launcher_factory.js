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

    return _.merge(_getCapabilities(wdioConfig), newCapabilities)
  }

  function _getCapabilities(wdioConfig) {
    if(_.isNil(wdioConfig.config.capabilities)) {
      throw new Error('must specify config.capabilities in your wdio configuration file')
    } else if (wdioConfig.config.capabilities.length < 1) {
      return { browserName: 'chrome' }
    } else if (_.isNil(wdioConfig.config.capabilities.browserName)) {
      return _.merge(wdioConfig.config.capabilities[0], { browserName: 'chrome' })
    } else {
      return wdioConfig.config.capabilities[0]
    }
  }

  this.withExtensionLoaded = this.withExtensionLoaded.bind(this)
}

module.exports = WdioLauncherFactory