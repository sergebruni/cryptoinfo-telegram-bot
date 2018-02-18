
const Command = require('../command')

class LastTweet extends Command {
  constructor(name){
    super('lasttweet')
    this.description = 'Send Last Tweet'
    this.usage = 'lasttweet'
  }
  run(bot, twitter, chat) {
    return twitter.sendTweet(bot, chat)
  }
}

module.exports = LastTweet;