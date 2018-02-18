
const Command = require('../command')

const utils   = require('../utils')

class Start extends Command {
  constructor(name){
    super('start')
    this.description = 'Start bot, register to the feed recipient list'
    this.usage = 'start'    
  }
  run(bot, twitter, chat) {
    const text = `Welcome, type /help for a command list`

    bot.sendMessage(chat, text)
    utils.registerChat(chat)    
    return twitter.sendTweet(bot, chat)
  }
}

module.exports = Start;