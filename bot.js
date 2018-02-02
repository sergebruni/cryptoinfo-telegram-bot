const TelegramBot = require('node-telegram-bot-api');
const Twitter     = require('twitter');

const _           = require('lodash');
const jsonFile    = require('jsonfile');

// Load config file
let config   = require("./config.json");

// Create Twitter API REST Client
let client = new Twitter(config.twitter); 

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.telegram.token, {polling: true});

// Send message on start command, show bot commands keyboard
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome", {
    "reply_markup": {
      "keyboard": [["Last Tweet"]]
    }
  });
});

// Listen for selected messages.
bot.on('message', (msg) => { 
  // Last Tweet action
  if (msg.text.indexOf("Last Tweet") === 0) {
    if (_.isUndefined(config.app.lastTweet)) {
      let text  = config.app.lastTweet.text + '\n';
          text += 'at '+ config.app.lastTweet.created_at + '\n';
      bot.sendMessage(msg.chat.id, text);
    }
    else
      getTweets(msg.chat.id)
  }
});

function getTweets(chatId = undefined) {
  
  let params = { screen_name: 'cryptochoe', exclude_replies: true };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      tweets = _.orderBy(tweets, ['id_str'], ['asc'])

      let text  = tweets[tweets.length - 1].text + '\n';
          text += 'at '+ tweets[tweets.length - 1].created_at + '\n';

      bot.sendMessage(chatId, text);

      config.app.lastTweet = tweets[tweets.length - 1];
      config.app.since_id = config.app.lastTweet.id;

      saveConfigFile();
    
    }
    else {
      console.log(error)
    }
  });
}

function saveConfigFile() {
  jsonFile.writeFileSync(__dirname + "/config.json", config);
  console.log('config file saved')
}