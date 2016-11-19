var Speaker = require('speaker')
var fs = require('fs')
var lame = require('lame')
var Volume = require("pcm-volume")

function getSpeaker() {
  return new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
  });
}

// TODO write a stream fader

module.exports = function(opts) {

  var volume, speaker, mp3Stream, decoder
  var paused = false
  var songs = []

  function stop() {
    volume.setVolume(0.2)
    setTimeout(function() {
      volume.setVolume(0)
    }, 20)
    if (speaker) speaker.close()
  }

  function pause() {
    if (!mp3Stream) return
    if (paused) {
      console.log("unpausing?")
      volume.pipe(speaker)
      decoder.resume()
      paused = false
    } else {
      console.log("pausing?")
      decoder.pause()
      volume.unpipe()
      paused = true
    }
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
    playFile(songs[nowPlaying], function() { playNext(cb) })
  }

  function playFile(path, cb) {
    // console.log(path);
    if (speaker) speaker.close()
    if (mp3Stream) mp3Stream.close()
    volume = new Volume()
    speaker = getSpeaker();
    if (cb) speaker.on('close', cb);
    mp3Stream = fs.createReadStream(path)
    decoder = new lame.Decoder()
    mp3Stream.on('data', function(data) {
      // displayData(this, data, cb);
    })
    .pipe(decoder)
    .pipe(volume)
    .pipe(speaker);
  }

  return {
    playFile : playFile,
    playFiles : playFiles,
    stop : stop,
    pause : pause,
    next : playNext,
    previous : playPrevious
  }
}
