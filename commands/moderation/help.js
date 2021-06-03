const Discord = require("discord.js");

module.exports = {
    name: 'help',
    aliases: ['commands'],
    desc: 'Lists all of the commands or info about a specific command.',
    dir: 'moderation',
    args: false,
    usage: '<command name>',
    hide: ['attach', 'reload', 'edituser'],
    guildOnly: true,
    cooldown: 5,
    async execute (message, args) {
        const commandsEmbed = new Discord.MessageEmbed();
        const { commands } = message.client;
        let guildPrefix;
        try{
            const { prefix } = await Guildconfigs.get(message.guild.id);
            guildPrefix = prefix;
        }catch(e){
            guildPrefix = defaultPrefix;
        }
        if(!args.length){
            commandsEmbed
                .setColor('#0099ff')
                .setTitle('Command List')
                .setDescription(`\nYou can send \`${guildPrefix}help [command name]\` to get info on a specific command!`)
                .addField('\u200b', '\u200b')
                .addField('Fun', `\`${commands.filter(command => command.dir === 'fun').map(command => command.name).join('` `')}\``)
                .addField('Game', `\`${commands.filter(command => command.dir === 'game').map(command => command.name).join('` `')}\``)
                .addField('Music', `\`${commands.filter(command => command.dir === 'music').map(command => command.name).join('` `')}\``)
                .addField('Social', `\`${commands.filter(command => command.dir === 'social').map(command => command.name).join('` `')}\``)
                .addField('Moderation', `\`${commands.filter(command => command.dir === 'moderation').map(command => command.name).join('` `')}\``)
                .addField('\u200b', '\u200b')
                .setTimestamp();
        }else{
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command || this.hide.includes(command.name)) {
                return message.reply('that\'s not a valid command!');
            }

            commandsEmbed
                .setColor('#0099ff')
                .setTitle(`${command.name}`)
                .setDescription(`${command.desc}`)
                .setTimestamp();

            if (command.aliases) commandsEmbed.addField('Other names', `\`${command.aliases.join('` `')}\``);
            if (command.usage) commandsEmbed.addField('Usage', `\`${guildPrefix}${command.name} ${command.usage}\``);

            commandsEmbed.addField('Cooldown', `${command.cooldown || 2} seconds`).addField('\u200b', '\u200b');
        }
        message.channel.send(commandsEmbed);
    }
}