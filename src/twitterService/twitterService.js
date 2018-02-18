const Twitter = require('twitter')

const utils   = require('../utils') 

const feed    = require('./tweet.json')

class TwitterService {

  constructor(config){
    this.twitter = new Twitter(config)
  }

  // Send Last Tweet function.
  sendTweet(bot, chat) {
    if (feed.lastTweet.text) {
      const text = `${feed.lastTweet.text}
      at ${feed.lastTweet.created_at}`
      bot.sendMessage(chat, text)
    }
    else {
      this.getTweets().then((res) => this.sendTweet(bot, chat)).catch((err) => console.error(err))
    }
  }

  // Get tweet promise through Twitter API
  getTweets() {
    return new Promise((resolve, reject) => {
      const params = { screen_name: 'cryptochoe', exclude_replies: true }

      this.twitter.get('statuses/user_timeline', params, (error, tweets, response) => {
        if (error) return reject(error)

        tweets.sort((a, b) => a.id_str > b.id_str)
        
        if (feed.since_id >= tweets[tweets.length - 1].id)
          return reject({
            curr_id: tweets[tweets.length - 1].id,
            last_id: feed.since_id,
            message: 'nothing to update'
          })
          
          feed.lastTweet = tweets[tweets.length - 1]
          feed.since_id  = feed.lastTweet.id

        utils.saveFile('./src/twitterService/tweet.json', feed)
        return resolve({success: true, message: 'feed updated'})
      });
    })
  }
}

module.exports = TwitterService