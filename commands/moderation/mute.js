const Discord = require("discord.js");

module.exports = {
    name: 'mute',
    desc: 'Mutes the mentioned user from the server.',
    dir: 'moderation',
    args: true,
    permissions: 'KICK_MEMBERS',
    usage: '<mention> [amount] {reason}',
    guildOnly: true,
    async execute (message, args) {
        const member = message.mentions.users.first();args.shift();
        const person = message.guild.members.resolve(member);
        if(!person) return message.channel.send(`You need to mention someone!`);
        if(person.id === message.author.id) return message.channel.send(`You can't mute yourself!`);
        const amount = parseInt(args.shift());
        if(!amount) return message.channel.send(`You should give a mute time!`);
        const reason = args.join(' ');
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Muting')
            .setDescription(`You are about to mute <@${person.id}> for ${amount} minutes.\nReason: \`${reason}\`\nRespond with ✅ to mute this person`);
        
        message.channel.send(commandsEmbed)
            .then(async(msg) => {
                msg.react('✅').then(() => msg.react('❎'));
                const filter = (reaction, user) => {
                    return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                
                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async(collected) => {
                        const reaction = collected.first();
                
                        if (reaction.emoji.name === '✅') {
                            let muterole = message.guild.roles.cache.find(muterole => muterole.name === "Muted");
                            if(!muterole){
                                try{
                                    muterole = await message.guild.roles.create({ data: 
                                        { 
                                            name: 'Muted',
                                            color: '#000000',
                                            permissions: ['VIEW_CHANNEL']
                                        }
                                    })
                                }catch(e){
                                    console.log(e);
                                }
                                message.guild.channels.cache.forEach(f => {
                                    f.updateOverwrite(muterole, { SEND_MESSAGES: false });
                                });
                            }
                            await(person.roles.add(muterole));
                            message.reply(`<@${person.id}> has been muted for ${amount} minutes!`);

                            setTimeout(function(){
                                person.roles.remove(muterole.id);
                                message.channel.send(`<@${person.id}> has been unmuted!`);   }, amount*60000);
                            return msg.delete({ timeout: 2000 });;
                        } else {
                            return msg.delete({ timeout: 100 });
                        }
                    })
            })
    }
}