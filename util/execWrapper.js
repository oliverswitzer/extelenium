const exec = require('child_process').exec

module.exports = (command, callback) => {
  exec(command, { maxBuffer: MAX_CRX_SIZE * SIZE_ADDED_BY_ENCODING }, callback)
}

const KB = 1024
const GiB = 1e6*KB

const MAX_CRX_SIZE = 2*GiB
const SIZE_ADDED_BY_ENCODING = 4/3
