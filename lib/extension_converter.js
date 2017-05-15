const execWrapper = require('../util/execWrapper')
const pathWrapper = require('../util/pathWrapper')
const fsWrapper = require('../util/fsWrapper')

function ExtensionConverter(options) {
  this._chromeExtensionPath = options.chromeExtensionPath
  this._execWrapper = options.execWrapper ||  execWrapper
  this._pathWrapper = options.pathWrapper ||  pathWrapper
  this._fsWrapper = options.fsWrapper     ||  fsWrapper

  this.toCrxFile = function () {
    return new Promise((resolve, reject) => {
      const createCrxFile = `crxmake --pack-extension=${this._chromeExtensionPath} --extension-output=${this._pathWrapper.basename(this._chromeExtensionPath)}.crx`

      this._execWrapper(createCrxFile, (err) => {
        if(err) { reject(err) }

        resolve()
      })
    })
  }

  this.cleanCrxAndPemFiles = function () {
    const extensionName = this._pathWrapper.basename(this._chromeExtensionPath)

    this._fsWrapper.removeSync(`${extensionName}.crx`)
    this._fsWrapper.removeSync(`${extensionName}.pem`)
  }

  this.toBase64String = function () {
    debugger;
    return new Promise((resolve, reject) => {
      const readAsBase64String = `openssl base64 -in ${this._pathWrapper.basename(this._chromeExtensionPath)}.crx`

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