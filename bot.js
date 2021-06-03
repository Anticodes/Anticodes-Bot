// Modules
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();

require('dotenv').config();

// Globals
global.defaultPrefix = process.env.DEFAULTPREFIX;
global.Guildconfigs = new Discord.Collection();
global.currency = new Discord.Collection();

// Commands
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const readCommands = (dir) =>{
    const commandFiles = fs.readdirSync(`./${dir}`);
    for (const file of commandFiles) {
        const stat = fs.lstatSync(`./${dir}/${file}`);
        if(stat.isDirectory()){
            readCommands([dir, file].join('/'));
        }else if(file.endsWith('.js')){
            const command = require(`./${dir}/${file}`);
            client.commands.set(command.name, command);
        }
    }
}

readCommands('commands');

// Main body
client.on('ready', async () => {
    const { Users, GuildConfigs } = await require('./utilities/dbObjects');
    client.user.setActivity("cnx help | Made by Antimax",{ type: "PLAYING" });
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    const storedPrefixes = await GuildConfigs.findAll();
    storedPrefixes.forEach(p => Guildconfigs.set(p.guildId, p));
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async(member) => {
    let memberrole = member.guild.roles.cache.find(memberrole => memberrole.name === "Member");
    if(!memberrole){
        try{
            memberrole = await member.guild.roles.create({ data: 
                { 
                    name: 'Member',
                    color: '#95a5a6',
                    permissions: ['VIEW_CHANNEL']
                }
            })
        }catch(e){
            console.log(e);
        }
    }
    member.roles.add(memberrole);
});

client.on('message', async(message) =>{
    if(message.author.bot) return;
    let currentPrefix = undefined;
    let input = message.content.toLowerCase(); 
    if(input.startsWith(defaultPrefix)){
        currentPrefix = defaultPrefix;
    }else if(message.guild){
        try{
            const { prefix } = await Guildconfigs.get(message.guild.id);
            currentPrefix = input.startsWith(prefix) ? prefix : undefined;
        }catch(e){
            await Guildconfigs.setPrefix(message.guild.id, defaultPrefix);
            console.log(e);
        }
    }
    if(currentPrefix){
        let args = message.content.slice(currentPrefix.length).trim().split(/ +/);
        let commandName = args.shift().toLowerCase();  

        const command = client.commands.get(commandName) 
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if(command.permissions){
            const authorPerms = message.channel.permissionsFor(message.author);
            if(!authorPerms || !authorPerms.has(command.permissions)){
                return message.reply("You don't have permission to use this command!");
            }
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
    
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${currentPrefix}${command.name} ${command.usage}\``;
            }
    
            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 2) * 1000;

        if (timestamps.has(message.author.id) && message.author.id != process.env.DEVID) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }else {
        client.commands.get('attach').talk(message);
    } 
});

client.login(process.env.TOKENVALUE);