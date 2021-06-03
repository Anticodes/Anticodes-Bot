const Discord = require("discord.js");

const infoText = (prefix) => {return `You are an angel, who is inside of a fictional heaven.
Your main goal is to get as much love as you can, and become one of the "Ten Commandments", in other words Top 10! **(${prefix} top)**
You can get money by begging to god **(${prefix} beg)**, working in office of heaven **(${prefix} work)** and more!
Then with that money, you can buy items **(${prefix} buy)** from the shop **(${prefix} shop)** and craft/cook **(${prefix} make)** new items with them!
Those crafted/cooked items has some special properties like gifting them **(${prefix} give)** to get love!
If you need more information about commands, you can use **(${prefix} help <command name>)**!`;
};

module.exports = {
    name: 'info',
    aliases: ['infoen'],
    desc: 'Gives information about the game.',
    dir: 'game',
    guildOnly: false,
    cooldown: 5,
    async execute (message, args) {
        const commandsEmbed = new Discord.MessageEmbed();
        let guildPrefix;
        try{
            const { prefix } = await Guildconfigs.get(message.guild.id);
            guildPrefix = prefix;
        }catch(e){
            guildPrefix = defaultPrefix;
        }
        commandsEmbed
            .setColor('#0099ff')
            .setTitle('Info about the game')
            .setDescription(infoText(guildPrefix))
            .setTimestamp();
        message.channel.send(commandsEmbed);
    }
}