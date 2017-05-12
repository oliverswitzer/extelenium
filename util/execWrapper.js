const exec = require('child_process').exec

module.exports = (command, callback) => {
  exec(command, callback)
}