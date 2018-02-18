const Command = require('../command')

const utils   = require('../utils') 

class Stop extends Command {

  constructor(name){
    super('stop')
    this.description = 'Unregister from the feed recipient list'
    this.usage = 'stop'
  }

  run(bot, chat) {
    const text = `You have successfully unregistered, you won't receive any feed.
Use /start command to register again.`

    utils.unregisterChat(chat)
    return bot.sendMessage(chat, text)
  }
}

module.exports = Stop