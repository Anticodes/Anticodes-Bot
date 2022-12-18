// Modules
const fs = require('fs');
const path = require("path");
const Discord = require('discord.js');

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds] });

require('dotenv').config();

// Globals
global.defaultPrefix = process.env.DEFAULTPREFIX;
global.Guildconfigs = new Discord.Collection();
global.currency = new Discord.Collection();

// Commands
client.commands = new Discord.Collection();
const commandCategoriesPath = path.join(__dirname, "commands");
const commandCategories = fs.readdirSync(commandCategoriesPath);

for (const category of commandCategories) {
    const categoryPath = path.join(commandCategoriesPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));;
    for (const file of commandFiles) {
        const filePath = path.join(categoryPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const cooldowns = new Discord.Collection();

// Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on('message', async (message) => {
    if (message.author.bot) return;
    let currentPrefix = undefined;
    let input = message.content.toLowerCase();
    if (input.startsWith(defaultPrefix)) {
        currentPrefix = defaultPrefix;
    } else if (message.guild) {
        try {
            const { prefix } = await Guildconfigs.get(message.guild.id);
            currentPrefix = input.startsWith(prefix) ? prefix : undefined;
        } catch (e) {
            await Guildconfigs.setPrefix(message.guild.id, defaultPrefix);
            console.log(e);
        }
    }
    if (currentPrefix) {
        let args = message.content.slice(currentPrefix.length).trim().split(/ +/);
        let commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
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
    } else {
        client.commands.get('attach').talk(message);
    }
});

client.login(process.env.TOKENVALUE);
