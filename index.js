var Input = require('./input')

// var input = Input({ vid : 1452, pid : 627 }, handleId)
var input = Input({ path : 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/SPI1@15,4/AppleIntelLpssGspi@1/AppleIntelLpssSpiController@1/AppleIntelLpssSpiDevice@0/AppleHSSPIController/Apple Internal Keyboard / Trackpad/Keyboard / Boot/AppleHSSPIHIDDriver' }, handleId)

function handleId(id) {
  console.log("loading", id)
}
