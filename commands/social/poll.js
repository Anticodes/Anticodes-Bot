const Discord = require("discord.js");

module.exports = {
    name: 'poll',
    desc: 'Creates a poll with given arguments.Example;\ncnx poll "How was your day?" 😂 "Great" 🙂 "Fine" 😐 "Decent" 😞 "Bad"\ncnx poll "Which one is your favorite animal?" 🐈 "Cat" 🐕 "Dog"',
    dir: 'social',
    args: true,
    permissions: 'MANAGE_MESSAGES',
    usage: '"[title]" <emoji 1> "[option 1]" <emoji 2> "[option 2]" ...',
    guildOnly: true,
    async execute (message, args) {
        const arguments = args.join(' ');
        const strs = await arguments.match(/"[^"]+"|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])|<a?:.+:\d+>/g)
        const { prefix } = await Guildconfigs.get(message.guild.id);
        if(!strs) return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
        if(strs.length % 2 !== 1) return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
        const str = strs.map(i => i.replace(/"/g, ''));
        const title = str.shift();
        if(!title) return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
        let desc = ``;
        let emojis = [];
        for(let i = 0; i < str.length; i+=2){
            desc += `${str[i]} ${str[i+1]}\n\n`;
            emojis.push(str[i]);
        }
        if(!desc.length) return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            .setDescription(desc);
        message.delete({ timeout: 2000 });
        return message.channel.send(commandsEmbed)
            .then(async(msg) => {
                for(let i = 0; i < emojis.length; i++){
                    try{
                        await msg.react(emojis[i]);
                    }catch(e){
                        msg.delete();
                        return message.channel.send(`You either didn't send an emoji or i can't access that emoji!`)
                    }
                }
            })
    }
}