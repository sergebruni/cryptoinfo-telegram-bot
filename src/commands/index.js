const Start = require('./start')
const Stop = require('./stop')
const Help = require('./help')
const Developer = require('./developer')
const PriceCheck = require('./pricecheck')
const LastTweet = require('./lasttweet')

const CommandList = {
  start: new Start(),
  stop: new Stop(),
  help : new Help(),
  developer: new Developer(),
  pricecheck: new PriceCheck(),  
  lasttweet: new LastTweet()
}

module.exports = CommandList

