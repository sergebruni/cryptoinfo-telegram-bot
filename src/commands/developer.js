
const Command  = require('../command.js')

class Developer extends Command {
  constructor(name){
    super('developer')
    this.description = 'Show developer info'
    this.usage = 'developer'
  }

  run(bot, chat) {

    const text = `Developed by @sergsss.
GitHub repo: https://github.com/sergebruni/cryptoinfo-telegram-bot`

    return bot.sendMessage(chat, text);
  }
}

module.exports = Developer