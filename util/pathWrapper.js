const path = require('path')

module.exports = {
  basename: (filePath) => {
    return path.basename(filePath)
  }
}