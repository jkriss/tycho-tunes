var fs = require('fs')
var HID = require('node-hid')
var inquirer = require('inquirer')

var config = {}

var devices = HID.devices()
// console.log("devices:", devices)
var questions = [
  { type : 'list', name : 'device', message : 'Which device is the RFID reader?', choices : devices.map((d) => d.product) },
  { name : 'pause', message : 'Swipe your pause card' },
  { name : 'previous', message : 'Swipe your previous track card' },
  { name : 'next', message : 'Swipe your next track card' }
]

inquirer.prompt(questions).then(function (answers) {
  // console.log("answers:", answers)
  devices.forEach(function(d) {
    if (d.product === answers.device)
    answers.device = d
  })
  fs.writeFileSync('config.json', JSON.stringify(answers, null, 2))
})
