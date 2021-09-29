const music = require('./music.js');

module.exports = {
    name: 'join',
    aliases: ['katil'],
    desc: 'Makes the bot join the channel.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}