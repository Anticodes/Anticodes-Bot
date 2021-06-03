const music = require('./music.js');

module.exports = {
    name: 'skip',
    aliases: ['gec', 'atla'],
    desc: 'Skips the song and continues from the queue.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}