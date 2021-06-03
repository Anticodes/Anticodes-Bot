const music = require('./music.js');

module.exports = {
    name: 'resume',
    aliases: ['devam'],
    desc: 'Resumes the song that has been paused.',
    dir: 'music',
    args: false,
    guildOnly: true,
    async execute (message, args){
        args.unshift(this.name);
        music.execute(message, args);
    }
}