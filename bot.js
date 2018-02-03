const TelegramBot = require('node-telegram-bot-api');
const Twitter     = require('twitter');

const _           = require('lodash');
const jsonFile    = require('jsonfile');
const CronJob     = require('cron').CronJob;

// Load config file
let config        = require("./config.json");

// Create Twitter API REST Client
let client = new Twitter(config.twitter); 

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.telegram.token, {polling: true});

// Listen for command messages.
bot.on('message', (msg) => { 
  // Last Tweet action
  if (msg.entities[0].type === 'bot_command'){
    switch (msg.text) {
      case '/start':
      case '/start@cryptoinfotelegrambot':
        bot.sendMessage(msg.chat.id, "Welcome, type /help for a command list");
        registerChat(msg.chat.id)
        sendTweet(msg.chat.id)
        break;
      case '/help':
      case '/help@cryptoinfotelegrambot':
        let text = `/start - Start bot show commands
        /help - Show bot help info
        /lasttweet - Send Last Tweet`;
        bot.sendMessage(msg.chat.id, text);
        break;
      case '/lasttweet':
      case '/lasttweet@cryptoinfotelegrambot':
        sendTweet(msg.chat.id)
        break;
    }
  }  
});

// Send Last Tweet function.
const sendTweet = (chatId) => {
  if (!_.isUndefined(config.app.lastTweet.text)) {
    let text = `${config.app.lastTweet.text}
    at ${config.app.lastTweet.created_at}`;
    bot.sendMessage(chatId, text);
  }
  else
    getTweets(chatId)
}

// Get tweet function through Twitter API
const getTweets = (chatId) => {  
  let params = { screen_name: 'cryptochoe', exclude_replies: true };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      tweets = _.orderBy(tweets, ['id_str'], ['asc'])
      
      if (config.app.since_id < tweets[tweets.length - 1].id) {
        config.app.lastTweet = tweets[tweets.length - 1];
        config.app.since_id = config.app.lastTweet.id;

        saveConfigFile(); 
        sendTweet(chatId);
      }    
      else 
        console.log('nothing to update')
      
    }
    else {
      console.log(error)
    }
  });
}

const registerChat = (chatId) => {
  if (_.indexOf(config.app.chatIdArr, chatId) === -1){
    config.app.chatIdArr.push(chatId);
    saveConfigFile(); 
  }
}

// Cron job to stay updated to Tweets
const job = new CronJob({
  cronTime: "*/5 * * * *",
  onTick: function() {
    console.log('cron job runing')
    _.forEach(config.app.chatIdArr, (chatId, key) => {
      getTweets(chatId);
    });    
  },
  runOnInit: true,
  timeZone: 'America/Caracas'
});

// Save new config file values
const saveConfigFile = () => {
  jsonFile.writeFileSync("./config.json", config);
  console.log('config file saved')
}