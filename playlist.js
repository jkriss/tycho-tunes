var glob = require('glob')

module.exports = function(opts) {

  function getTunes(path, cb) {
    glob(path+"/**/*.mp3", cb)
  }

  return {
    getTunes : getTunes
  }
}
