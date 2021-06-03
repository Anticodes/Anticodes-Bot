const Discord = require("discord.js");

module.exports = {
    name: 'leaderboard',
    aliases: ['leader', 'top'],
    desc: 'Shows 10 angels of The Heaven!',
    dir: 'game',
    args: false,
    guildOnly: true,
    cooldown: 20,
    commands: ['Love', 'Patience', 'Truth', 'Purity', 'Faith', 'Pacifism', 'Reticence', 'Repose', 'Selflessness', 'Piety'],
    async execute (message, args) {
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`<a:hype:806182511331901450> 10 Commandments of the god! <a:hype:806182511331901450>`)
            .setDescription(
                //TODO: need to improve this part
                (await Promise.all(currency.sort((a, b) => b.love - a.love)
                    .first(10)
                    .map(async(user, position) => `**${position + 1}**. ${this.commands[position]} - ${((await message.client.users.fetch(user.user_id, true)).username)}: **${user.love}** ❤`)
                    )).join('\n\n')
            )
            .setTimestamp();        
        return message.channel.send(commandsEmbed);
    }
}