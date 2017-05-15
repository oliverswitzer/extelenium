const fs = require('fs')

module.exports = {
  removeSync: (path) => {
    fs.unlinkSync(path)
  }
}