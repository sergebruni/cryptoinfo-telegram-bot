const CoinBase    = require('coinbase').Client

// Load config file
const config   = require('../../config.json')

// Create Coinbase API REST Client
const coinbase = new CoinBase(config.coinbase)

const Command = require('../command.js')

class PriceCheck extends Command {
  constructor(name){
    super('pricecheck')
    this.description = 'Check currency price | usage: /pricecheck <currency> <format> | example: /pricecheck btc usd'
    this.usage = 'pricecheck <currency> <format>'
    this.example = 'pricecheck btc usd'
  }

  run(bot, chat, params) {

    coinbase.getBuyPrice({'currencyPair': `${params[0]}-${params[1]}`}, (err, obj) => {
      if (err) return bot.sendMessage(chatId, `Can't process your request`)
      
      return bot.sendMessage(chat, `${params[0]}: ${obj.data.amount} ${params[1]}`)  
    });
    
  }
}

module.exports = PriceCheck;