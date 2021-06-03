module.exports = {
    name: 'member',
    aliases: ['newmember', 'memberrole'],
    desc: `Gives a default 'Member' role to new members if activated.`,
    dir: 'moderation',
    args: true,
    usage: '[on, off]',
    permissions: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 5,
    async execute (message, args) {
        
        if(args[0] === 'on'){
            await Guildconfigs.setMember(message.guild.id, true);
            message.channel.send("Okay, i will be adding 'Member' role to new members from now!");
        }else if(args[0] === 'off'){
            await Guildconfigs.setMember(message.guild.id, false);
            message.channel.send("Okay, i will **stop** adding 'Member' role to new members from now!");
        }
    }
}