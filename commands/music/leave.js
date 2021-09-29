const music = require('./music.js');

module.exports = {
    name: 'leave',
    aliases: ['ayril'],
    desc: 'Makes the bot leave the channel.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}