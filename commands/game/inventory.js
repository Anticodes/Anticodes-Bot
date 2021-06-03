const Discord = require("discord.js");

module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    desc: 'Shows the inventory of the user.',
    dir: 'game',
    args: false,
    usage: '[mention]',
    guildOnly: true,
    cooldown: 5,
    async execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        const user = await currency.getUser(target.id);
        const items = await user.getItems();

        if (!items.length) return message.channel.send(`${target.username} has nothing!`);
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`${target.username}'s Inventory`, target.avatarURL({ dynamic:true }))
            .setDescription(`${items.map(i => `**${i.amount}** - ${i.item.name} ${i.item.image}`).join('\n\n')}`)
            .setTimestamp();
        return message.channel.send(commandsEmbed);
    }
}