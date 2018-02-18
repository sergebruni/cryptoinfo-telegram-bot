
const jsonFile = require('jsonfile')
// Load config file
const config   = require('../config.json')

// Save file values
const saveFile = (path, data) => { 
  return jsonFile.writeFileSync(path, data, {spaces: 2}) 
}

// Register chat id function
const registerChat = (chatId) => {
  if (config.app.chatIdArr.indexOf(chatId) !== -1){ return }  
  config.app.chatIdArr.push(chatId)
  return saveFile('../config.json', config)
}

// Unegister chat id function
const unregisterChat = (chatId) => {
  if (config.app.chatIdArr.indexOf(chatId) === -1){ return }
  config.app.chatIdArr.splice(config.app.chatIdArr.indexOf(chatId), 1)
  return saveFile('../config.json', config)
}

const Utils = {
  saveFile: saveFile,
  registerChat: registerChat,
  unregisterChat: unregisterChat
}

module.exports = Utils