const music = require('./music.js');

module.exports = {
    name: 'pause',
    aliases: ['duraklat', 'durak'],
    desc: 'Pauses the song until a resume command.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}