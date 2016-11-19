var Mpg = require('mpg123')
var Path = require('path')

module.exports = function(opts) {

  var player
  var songs = []

  function stop() {
    if (player) {
      player.stop()
      player.close()
    }
  }

  function pause() {
    if (player) player.pause()
  }

  function close() {
    if (player) player.close()
  }

  var nowPlaying = 0

  function playNext(cb) {
    var song = songs[++nowPlaying]
    if (song) playFile(song, function() { playNext(cb) })
    else if (cb) cb()
  }

  function playPrevious(cb) {
    var song = songs[--nowPlaying]
    if (!song) song = songs[++nowPlaying]
    playFile(song, function() { playNext(cb) })
  }

  function playFiles(paths, cb) {
    songs = paths
    nowPlaying = 0
    playFile(songs[nowPlaying], function() { playNext(cb) })
  }

  function playFile(path, cb) {
    var songFile = Path.resolve(path)
    console.log("playing", songFile)
    if (!player) player = new Mpg()
    player.play(songFile)
    var ended = false
    player.removeAllListeners()
    player.once('end', cb)
  }

  return {
    playFile : playFile,
    playFiles : playFiles,
    stop : stop,
    close : close,
    pause : pause,
    next : playNext,
    previous : playPrevious,
  }
}
