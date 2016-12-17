var Input = require('./input')
var playlist = require('./playlist')()
var Path = require('path')
var Player = require('./player')

var input = Input({ vid : 65535, pid : 53 }, handleId)
// var input = Input({ vid : 2303, pid : 9 }, handleId)
// var input = Input({ path : 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/SPI1@15,4/AppleIntelLpssGspi@1/AppleIntelLpssSpiController@1/AppleIntelLpssSpiDevice@0/AppleHSSPIController/Apple Internal Keyboard / Trackpad/Keyboard / Boot/AppleHSSPIHIDDriver' }, handleId)

var libraryRoot = './library/'

var player = Player()
var isPlaying = false

var specialIds = {
  '21848835' : function() {
    console.log("pausing...")
    player.pause()
    // player.stop()
  },
  // '2' : function() {
  '21855731' : function() {
    console.log("previous...")
    player.previous()
  },
  // '3' : function() {
  '22953027' : function() {
    console.log("next...")
    player.next()
  },
  '0' : function() {
    console.log("exiting...")
    if (player) player.close()
    input.close()
    process.exit()
  }
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
