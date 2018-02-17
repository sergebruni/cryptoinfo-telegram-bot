
const Command = require('../command.js')

class Help extends Command {
  constructor(name) {
    super('help')
    this.description = 'Show bot help info'
    this.usage = 'help'
  }

  run(bot, chat) {

    const text = `/start - Start bot, register to the feed recipient list
/stop - Unregister from the feed recipient list
/lasttweet - Send Last Tweet
/pricecheck - Check currency price | usage: /pricecheck <currency> <format> | example: /pricecheck btc usd
/help - Show bot help info
/developer - Show developer info`

    return bot.sendMessage(chat, text)
  }
}

module.exports = Help