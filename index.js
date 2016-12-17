var Input = require('./input')
var playlist = require('./playlist')()
var Path = require('path')
var Player = require('./player')
var fs = require('fs')
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

var input = Input({ vid : config.device.vendorId, pid : config.device.productId }, handleId)

var libraryRoot = config.libraryRoot || './library/'

var player = Player()

var specialIds = {}

specialIds[config.pause] = function() {
  console.log("pausing...")
  player.pause()
}

specialIds[config.previous] = function() {
  console.log("previous...")
  player.previous()
}

specialIds[config.next] = function() {
  console.log("next...")
  player.next()
}

function handleId(id) {
  console.log("loading", id)
  if (specialIds[id]) {
    specialIds[id]()
  } else {
    playlist.getTunes(Path.join(libraryRoot, id), function(err, files) {
      if (err) console.error("Error loading tunes:", err)
      else {
        console.log("playing", files)
        player.playFiles(files, function() {
          console.log("done!")
        })
      }
    })
  }
}

console.log("ready!")
