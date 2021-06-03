const music = require('./music.js');

module.exports = {
    name: 'loop',
    aliases: ['tekrar'],
    desc: 'Loops the current song.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}