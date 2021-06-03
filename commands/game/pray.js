module.exports = {
    name: 'pray',
    aliases: ['p'],
    desc: 'Prays to the god and asks for love.',
    dir: 'game',
    args: false,
    usage: '[mention]',
    guildOnly: true,
    cooldown: 300,
    async execute (message, args) {
        const transferTarget = message.mentions.users.first() || message.author;
        currency.addLove(transferTarget.id, 1);
        return message.channel.send(`You prayed to the god for ${message.author === transferTarget ? `yourself` : transferTarget.username} 🙏\n${message.author === transferTarget ? `You` : transferTarget.username} got gods love ❤`);
    }
}