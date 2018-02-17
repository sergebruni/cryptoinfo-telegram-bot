class Command {

  constructor(name){
    if (!name) console.error('command must have a name')
    this.name = name
    this.description = ''
    this.usage = ''
    this.example = ''

    console.log('Command', `${name} loaded`)
  }

}

module.exports = Command;