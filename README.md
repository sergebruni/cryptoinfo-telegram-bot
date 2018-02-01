# cryptoinfo-telegram-bot
A Telegram Bot that retrieves CryptoChoe tweets about crypto currency and trades info. https://t.me/cryptoinfotelegrambot

## Setup

Clone the project.

```
git clone https://github.com/sergebruni/cryptoinfo-telegram-bot.git

cd cryptoinfo-telegram-bot
```

Create config.json file with these fields:

```
{
  "telegram":{
    "token":""
  },
  "twitter":{
    "consumer_key":"",
    "consumer_secret":"",
    "access_token_key":"",
    "access_token_secret":""
  }
}
```

Install the dependencies, and run the project

```
yarn

yarn run start
```