var hid = require('hidstream')

module.exports = function(opts, listener) {

  var device = new hid.device({ parser : hid.parser.keyboard, path : opts.path })

  var buffer = ""
  var debounce;

  device.on("data", function(data) {
    if (data.keyCodes[0] === 41) device.close() // close on esc

    // ignore multiples?
    var primaryChar
    var charCount = 0
    data.charCodes.forEach(function(char) {
      if (char !== '') {
        primaryChar = char
        charCount++
      }
    })
    if (charCount === 1) getChar(primaryChar)
  })

  function getChar(char) {
    // console.log("typed:", char)
    buffer += char
    if (debounce) clearTimeout(debounce)
    debounce = setTimeout(send, 500)
  }

  // if it's been quiet for 500 ms, send the buffer
  function send() {
    listener(buffer)
    buffer = ""
  }

}
