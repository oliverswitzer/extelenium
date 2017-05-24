const path = require('path')

function ManifestParser(options) {
  this._manifest = readManifest(options.chromeExtensionPath)

  this.name = function () {
    return this._manifest.name
  }
}

function readManifest(extensionPath) {
  return require(path.resolve(extensionPath + '/manifest.json'))
}

module.exports = ManifestParser
