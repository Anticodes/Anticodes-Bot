const music = require('./music.js');

module.exports = {
    name: 'queue',
    aliases: ['sira', 'q'],
    desc: 'Displays the current songs in the queue.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}