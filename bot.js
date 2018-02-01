const TelegramBot = require('node-telegram-bot-api');
const Twitter     = require('twitter');

// Load config file
var config   = require(__dirname + "/config.json");

// Create Twitter API REST Client
var client = new Twitter(config.twitter); 

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.telegram.token, {polling: true});

// Test Telegram Bot. Send message on start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome");
});

// Test Twitter Client
client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
  if (!error)
    console.log(tweets);
  else
    console.log(error)
});