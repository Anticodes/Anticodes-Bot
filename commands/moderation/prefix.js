module.exports = {
    name: "prefix",
    desc: "Shows or sets the prefix of your commands.",
    dir: 'moderation',
    permissions: 'ADMINISTRATOR',
    usage: '<set|default> <prefix to set>',
    args: false,
    guildOnly: true,
    async execute (message, args){
        if(!args.length){
            try{
                const { prefix } = await Guildconfigs.get(message.guild.id);
                return message.channel.send(`Prefix for this server is: ${prefix}`);
            }catch(e){
                return message.channel.send(`Prefix for this server is: ${defaultPrefix}`);
            }
        }
        const command = args.shift();
        switch(command){
            case 'set':
                try {
                    await Guildconfigs.setPrefix(message.guild.id, args[0].toLowerCase());
                    return message.channel.send(`Prefix has changed to: ${args[0].toLowerCase()}`);
                }
                catch (e) {
                    console.log(e);
                    return message.reply('something went wrong while changing the prefix!');
                }
            case 'default':
                await Guildconfigs.setPrefix(message.guild.id, defaultPrefix);
                return message.channel.send(`Prefix has changed to: ${defaultPrefix}`);
        }
    }
}