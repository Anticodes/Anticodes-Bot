const Discord = require("discord.js");

module.exports = {
    name: 'embed',
    desc: 'Creates a custom embed from given arguments. You can write \\n for new lines without pressing enter.',
    dir: 'moderation',
    args: true,
    permissions: 'MANAGE_MESSAGES',
    usage: '"[title]" "[description]"',
    guildOnly: true,
    async execute (message, args) {
        const arguments = args.join(' ');
        const str = Array.from(arguments.matchAll(/"([^"]+)"/g));
        const { prefix } = await Guildconfigs.get(message.guild.id);
        if(!str || str.length !== 2) return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
        const title = str[0][1].replaceAll('\\n', '\n');
        if(title.length > 256)message.channel.send(`Title can't be longer than 256 characters!\nYou may forgot to put a space after desc.`);
        const desc = str[1][1].replaceAll('\\n', '\n');
        if(desc.length > 2048)message.channel.send(`Description can't be longer than 2048 characters!\nSorry but that's what papa discord says.`);
        if(title && desc){
            const commandsEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title)
                .setDescription(desc);
            message.delete({ timeout: 2000 });
            return message.channel.send(commandsEmbed);
        }
        return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
    }
}