const Discord = require('discord.js');

module.exports = {
    name: 'randnum',
    aliases: ['rnum'],
    desc: 'Gives a random number between arguments.',
    dir: 'fun',
    args: true,
    usage: '<min> <max>',
    guildOnly: true,
    async execute (message, args) {
        const min = parseInt(args.shift());
        const max = parseInt(args.shift());
        if(min && max){
            const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Random Number Generator`)
            .setDescription(`Randomly generated number from ${min} to ${max}:\nNumber: ${Math.floor(Math.random() * (max - min)) + min}`);
            return message.channel.send(commandsEmbed);
        }
        const { prefix } = await Guildconfigs.get(message.guild.id);
        return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
    }
}