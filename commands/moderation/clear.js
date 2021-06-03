const Discord = require("discord.js");

module.exports = {
    name: 'clear',
    aliases: ['clr', 'cc'],
    desc: 'Deletes chat messages by specified amount.',
    dir: 'moderation',
    args: true,
    permissions: 'MANAGE_MESSAGES',
    usage: '<amount>',
    guildOnly: true,
    async execute (message, args) {
        const amount = parseInt(args.shift());
        if(!amount)message.channel.send(`You need to enter a number!`);
        if(amount > 100 || amount < 1)message.channel.send(`Amount should be between 1-100`);
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Deleting messages')
            .setDescription(`You are about to delete ${amount} messages!\nRespond with ✅ to delete the messages`);
        
        message.channel.send(commandsEmbed)
            .then(msg => {
                msg.react('✅').then(() => msg.react('❎'));
                const filter = (reaction, user) => {
                    return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                
                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                
                        if (reaction.emoji.name === '✅') {
                            msg.channel.bulkDelete(amount)
                                .then(messages => msg.channel.send(`Deleted ${messages.size} messages`).then(msg => {msg.delete({ timeout: 2000 })}))
                                .catch(console.error);
                            return;
                        } else {
                            msg.delete({ timeout: 2000 });
                            return;
                        }
                    })
            })
    }
}