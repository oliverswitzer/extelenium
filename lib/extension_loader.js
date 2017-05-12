function ExtensionLoader(options) {
  this._chromeExtensionPath = options.chromeExtensionPath
  this._execWrapper = options.execWrapper
  this._pathWrapper = options.pathWrapper

  this.load = function() {
    return new Promise((resolve, reject) => {
      this._execWrapper(`crxmake --pack-extension=${this._chromeExtensionPath} --extension-output=${this._pathWrapper.basename(this._chromeExtensionPath)}.crx`, (err) => {
        if(err) { reject(err) }

        this._execWrapper(`openssl base64 -in ${this._pathWrapper.basename(this._chromeExtensionPath)}.crx`, (err, stdout) => {
          if(err) { reject(err) }

          resolve(stdout)
        })
      })
    }).catch(err => console.error(err))
  }
}

module.exports = ExtensionLoader;