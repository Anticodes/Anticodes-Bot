module.exports = {
    name: 'balance',
    aliases: ['bal', 'money', 'love'],
    desc: 'Shows the user balance.',
    dir: 'game',
    args: false,
    usage: '[mention]',
    guildOnly: true,
    cooldown: 5,
    async execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(
                `${target.username} has **${currency.getBalance(target.id)}** <a:money:805767768712544266>\nAlso has **${currency.getLove(target.id)}** ❤`
            );
    }
}