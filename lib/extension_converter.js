function ExtensionConverter(options) {
  this._chromeExtensionPath = options.chromeExtensionPath
  this._execWrapper = options.execWrapper
  this._pathWrapper = options.pathWrapper

  this.toCrxFile = function () {
    return new Promise((resolve, reject) => {
      const createCrxFile = `crxmake --pack-extension=${this._chromeExtensionPath} --extension-output=${this._pathWrapper.basename(this._chromeExtensionPath)}.crx`

      this._execWrapper(createCrxFile, (err) => {
        if(err) { reject(err) }

        resolve()
      })
    })
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
}

module.exports = ExtensionConverter