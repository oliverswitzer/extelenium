const execWrapper = require('../util/execWrapper')
const fsWrapper = require('../util/fsWrapper')
const ManifestParser = require('../lib/manifest_parser')

const path = require('path')
const _ = require('lodash')

function ExtensionConverter(options) {
  this._chromeExtensionPath = options.chromeExtensionPath
  this._execWrapper = options.execWrapper ||  execWrapper
  this._fsWrapper = options.fsWrapper     ||  fsWrapper
  this._manifestParser = new ManifestParser({chromeExtensionPath: this._chromeExtensionPath})

  this.toCrxFile = function () {
    return new Promise((resolve, reject) => {
      const createCrxFile = `crxmake --pack-extension=${path.resolve(this._chromeExtensionPath)} --extension-output=${this._crxmakeOutputPath()}.crx --key-output=${this._crxmakeOutputPath()}.pem`

      this._execWrapper(createCrxFile, (err) => {
        if(err) { reject(err) }

        resolve()
      })
    })
  }

  this.cleanCrxAndPemFiles = function () {
    this._fsWrapper.removeSync(`${this._crxmakeOutputPath()}.crx`)
    this._fsWrapper.removeSync(`${this._crxmakeOutputPath()}.pem`)
  }

  this._crxmakeOutputPath = function() {
    return _.kebabCase(this._manifestParser.name())
  }

  this.toBase64String = function () {
    return new Promise((resolve, reject) => {
      const readAsBase64String = `openssl base64 -in ${this._crxmakeOutputPath()}.crx`

      this._execWrapper(readAsBase64String, (err, stdout) => {
        if(err) { reject(err) }

        resolve(stdout)
      })
    })
  }

  this.toBase64String = this.toBase64String.bind(this);
  this.toCrxFile = this.toCrxFile.bind(this);
  this.cleanCrxAndPemFiles = this.cleanCrxAndPemFiles.bind(this);
}

module.exports = ExtensionConverter