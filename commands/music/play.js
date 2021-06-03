const music = require('./music.js');

module.exports = {
    name: 'play',
    aliases: ['oynat', 'add'],
    desc: 'Plays the song either with a link or a search term.',
    dir: 'music',
    args: true,
    usage: '<link|search terms>',
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}