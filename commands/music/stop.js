const music = require('./music.js');

module.exports = {
    name: 'stop',
    aliases: ['dur', 'durdur'],
    desc: 'Stops the song, empties the queue and leaves the voice chat.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}