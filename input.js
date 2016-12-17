var hid = require('hidstream')
var HID = require('node-hid')

module.exports = function(opts, listener) {

  var devices = HID.devices()
  console.log("devices:", devices)

  // var device = new hid.device({ parser : hid.parser.keyboard, path : opts.path })
  var device = new hid.device({ parser : hid.parser.newline, path : opts.path, vid : opts.vid, pid : opts.pid })

  // var buffer = ""
  // var debounce;

  device.on("data", function(data) {
    console.log(data)
    listener(data.trim())
    // if (data.keyCodes[0] === 41) device.close() // close on esc
    //
    // // ignore multiples?
    // var primaryChar
    // var charCount = 0
    // data.charCodes.forEach(function(char) {
    //   if (char !== '') {
    //     primaryChar = char
    //     charCount++
    //   }
    // })
    // if (charCount === 1) getChar(primaryChar)
  })

  // function getChar(char) {
  //   // console.log("typed:", char)
  //   buffer += char
  //   if (debounce) clearTimeout(debounce)
  //   debounce = setTimeout(send, 200)
  // }
  //
  // // if it's been quiet for 500 ms, send the buffer
  // function send() {
  //   listener(buffer)
  //   buffer = ""
  // }

  return {
    close : function() {
      device.close()
    }
  }

}
