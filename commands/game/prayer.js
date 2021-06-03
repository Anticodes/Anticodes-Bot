module.exports = {
    name: 'prayer',
    aliases: ['prayers', 'follower', 'followers'],
    desc: 'Shows the prayers of user.',
    dir: 'game',
    args: false,
    usage: '[mention]',
    guildOnly: true,
    cooldown: 5,
    async execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.username} has **${currency.getPrayer(target.id)}** prayers!`);
    }
}