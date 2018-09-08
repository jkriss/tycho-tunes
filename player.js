var mpg = require('mpg123')
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
    if (!player) player = new mpg.MpgPlayer()
    player.play(songFile)
    var ended = false
    player.removeAllListeners()

    if (path.match(/-loop\.mp3/)) {
      player.on('frame', function(data) {
        // if we're on the last frame, seek to the beginning
        // console.log(data)
        if (data[1] === '0') {
          // console.log("looping...")
          player._cmd("JUMP", 0)
        }
      })
    } else {
      player.once('end', cb)
    }
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
