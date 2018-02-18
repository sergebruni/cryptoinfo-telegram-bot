const TelegramBot    = require('node-telegram-bot-api')

const TwitterService = require('./src/twitterService/twitterService')
const Cron           = require('./src/cron')

// Load config file
const config         = require('./config.json')

// Create TwitterService client
const twitter = new TwitterService(config.twitter)

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.telegram.token, {polling: true})

// Load commands
const commands       = require('./src/commands/index')

// Create botan.io client for bot statistics tracking
const Botan = require('botanio')(config.botan.token)

// Create Cron client
const cronJob = new Cron(twitter)
cronJob.run()

// Listen for command messages.
bot.on('message', (msg) => { 
  if (msg.entities[0].type !== 'bot_command'){ return }  

  const [cmd, ...args] = (msg.text || '').split(' ')

  switch (cmd) {
    case '/start':
    case '/start@cryptoinfotelegrambot':
      commands['start'].run(bot, twitter, msg.chat.id)
      Botan.track(msg, 'start')
      break;    
    case '/stop':
    case '/stop@cryptoinfotelegrambot':
      commands['stop'].run(bot, msg.chat.id)
      Botan.track(msg, 'stop')
      break;   
    case '/lasttweet':
    case '/lasttweet@cryptoinfotelegrambot':
      commands['lasttweet'].run(bot, twitter, msg.chat.id)
      Botan.track(msg, 'lasttweet')
      break;
    case '/pricecheck':
    case '/pricecheck@cryptoinfotelegrambot':
      commands['pricecheck'].run(bot, msg.chat.id, args)
      Botan.track(msg, 'pricecheck')
      break;
    case '/help':
    case '/help@cryptoinfotelegrambot':
      commands['help'].run(bot, msg.chat.id)
      Botan.track(msg, 'help')
      break;
    case '/developer':
    case '/developer@cryptoinfotelegrambot':
      commands['developer'].run(bot, msg.chat.id)
      Botan.track(msg, 'developer')
      break;
    default:
      bot.sendMessage(msg.chat.id, `command not recognized, type /help for a list of commands`);
      break;
  }
})