
const CronJob = require('cron').CronJob

const config  = require('../config.json')

class Cron {
  constructor(twitterService){
    if (!twitterService) return console.error('twitter service needed for cron job')
    this.twitter = twitterService

    // Cron job to stay updated to Tweets
    this.job = new CronJob({
      cronTime: "*/5 * * * *",
      onTick: async () => {
        try {
          const res = await this.twitter.getTweets()
          config.app.chatIdArr.forEach(this.twitter.sendTweet)
        } 
        catch (err) { console.error(err) }      
      },
      runOnInit: false,
      timeZone: 'America/Caracas'
    })
  }

  run() {
    return this.job.start()
  }
}

module.exports = Cron
