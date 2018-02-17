const Help = require('./help')
const Developer = require('./developer')
const PriceCheck = require('./pricecheck')

const CommandList = {
  help : new Help(),
  developer: new Developer(),
  pricecheck: new PriceCheck()
}

module.exports = CommandList

