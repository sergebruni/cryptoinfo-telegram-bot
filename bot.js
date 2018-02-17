const TelegramBot = require('node-telegram-bot-api');
const Twitter     = require('twitter');
const CoinBase     = require('coinbase').Client;

const _           = require('lodash');
const jsonFile    = require('jsonfile');
const CronJob     = require('cron').CronJob;

// Load config file
const config      = require("./config.json");

// Create Twitter API REST Client
const twitter = new Twitter(config.twitter);

// Create Twitter API REST Client
const coinbase = new CoinBase(config.coinbase);

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.telegram.token, {polling: true});

// Create botan.io client for bot statistics tracking
const Botan = require('botanio')(config.botan.token);

// Listen for command messages.
bot.on('message', (msg) => { 
  if (msg.entities[0].type !== 'bot_command'){ return }  

  const [cmd, ...args] = (msg.text || '').split(' ')

  switch (cmd) {
    case '/start':
    case '/start@cryptoinfotelegrambot':
      handleStart(msg.chat.id)
      break;    
    case '/stop':
    case '/stop@cryptoinfotelegrambot':
      handleStop(msg.chat.id)
      break;   
    case '/lasttweet':
    case '/lasttweet@cryptoinfotelegrambot':
      handleLastTweet(msg.chat.id)
      break;
    case '/pricecheck':
    case '/pricecheck@cryptoinfotelegrambot':
      handlePriceCheck(msg.chat.id, args)
      break;
    case '/help':
    case '/help@cryptoinfotelegrambot':
      handleHelp(msg.chat.id)
      break;
    case '/developer':
    case '/developer@cryptoinfotelegrambot':
      handleDeveloper(msg.chat.id)
      break;
    default:
      bot.sendMessage(msg.chat.id, `command not recognized, type /help for a list of commands`);
      break;
  }
});

// Send Last Tweet function.
const sendTweet = (chatId) => {
  if (!_.isUndefined(config.app.lastTweet.text)) {
    const text = `${config.app.lastTweet.text}
    at ${config.app.lastTweet.created_at}`;
    bot.sendMessage(chatId, text);
  }
  else {
    getTweets().then((res) => sendTweet(chatId)).catch((err) => console.log(err))
  }  
}

// Get tweet promise through Twitter API
const getTweets = () => new Promise(
  function (resolve, reject) {
    const params = { screen_name: 'cryptochoe', exclude_replies: true };

    twitter.get('statuses/user_timeline', params, (error, tweets, response) => {
      if (error) return reject(error)

      tweets = _.orderBy(tweets, ['id_str'], ['asc'])
      
      if (config.app.since_id >= tweets[tweets.length - 1].id) 
        return reject({
          curr_id: tweets[tweets.length - 1].id,
          last_id: config.app.since_id,
          message: 'nothing to update'
        })
        
      config.app.lastTweet = tweets[tweets.length - 1];
      config.app.since_id = config.app.lastTweet.id;

      saveConfigFile()
      return resolve({success: true, message: 'feed updated'})
    });
  }
);

// Register chat id function
const manageChats = (chatId, register = true) => {
  console.log(chatId)
  if (register) {
    if (_.indexOf(config.app.chatIdArr, chatId) !== -1){ return }
    config.app.chatIdArr.push(chatId)
  }
  else {
    if (_.indexOf(config.app.chatIdArr, chatId) === -1){ return }
    const idx = config.app.chatIdArr.indexOf(chatId)
    config.app.chatIdArr.splice(idx, 1)
  }   
  
  saveConfigFile();   
}

// Cron job to stay updated to Tweets
const job = new CronJob({
  cronTime: "*/5 * * * *",
  onTick: async function () {
    try {
      const res = await getTweets()
      config.app.chatIdArr.forEach(sendTweet)      
    } 
    catch (err) { console.error(err) }      
  },
  runOnInit: false,
  timeZone: 'America/Caracas'
});

// Start Cron job
job.start();

// Save new config file values
const saveConfigFile = () => {
  jsonFile.writeFileSync("./config.json", config);
  console.log('config file saved')
}
// Start command handler
const handleStart = (chatId) => {
  const text = `Welcome, type /help for a command list`

  bot.sendMessage(chatId, text)
  manageChats(chatId)
  sendTweet(chatId)

  Botan.track(msg, 'start')
}
// Stop command handler
const handleStop = (chatId) => {
  const text = `You have successfully unregistered, you won't receive any feed.
  Use /start command to register again.`

  bot.sendMessage(chatId, text)
  manageChats(chatId, false)

  Botan.track(msg, 'stop')
}
// Help command handler
const handleHelp = (chatId) => {
  const text = `/start - Start bot, register to the feed recipient list
  /stop - Unregister from the feed recipient list
  /lasttweet - Send Last Tweet
  /pricecheck - Check currency price | usage: /pricecheck <currency> <format> | example: /pricecheck btc usd
  /help - Show bot help info
  /developer - Show developer info`;

  bot.sendMessage(chatId, text);
  
  Botan.track(msg, 'help')
}
// Last Tweet command handler
const handleLastTweet = (chatId) => {
  sendTweet(chatId)
  Botan.track(msg, 'lasttweet')
}
// Price Check command handler
const handlePriceCheck = (chatId, params) => {
  console.log(params)
  coinbase.getBuyPrice({'currencyPair': `${params[0]}-${params[1]}`}, (err, obj) => {
    if (err) return bot.sendMessage(chatId, `Can't process your request`)
    
    bot.sendMessage(chatId, `${params[0]}: ${obj.data.amount} ${params[1]}`)  
  });
  Botan.track(msg, 'pricecheck')
}
// Developer command handler
const handleDeveloper = (chatId) => {
  const text = `Developed by @sergsss.
  GitHub repo: https://github.com/sergebruni/cryptoinfo-telegram-bot`
  bot.sendMessage(chatId, text);
  
  Botan.track(msg, 'developer')
}
  