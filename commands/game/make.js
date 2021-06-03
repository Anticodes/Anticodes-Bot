const { Recipes, Items } = require('../../utilities/dbObjects');
const { Op } = require('sequelize');
const Discord = require("discord.js");

module.exports = {
    name: 'make',
    aliases: ['craft', 'recipe', 'm'],
    desc: 'Uses a recipe to make a new item.\nUse the command without arguments to see the recipes.',
    dir: 'game',
    args: false,
    usage: '[ [amount] <recipe> ]',
    guildOnly: true,
    cooldown: 15,
    async execute (message, args) {
        if(!args.length){
            const recipes = await Recipes.findAll({ include: ['item'] });
            const commandsEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`<a:crystal:805758737062166558> Heaven's recipe book <a:crystal:805758737062166558>`);
            for(const recipe of recipes){
                const msg = await Promise.all(recipe.recipe.map(async(rcp) => {
                    const item = await Items.findOne({ where: { id: rcp.id } });
                    return `**${rcp.amount}** - ${item.image} ${item.name}`;
                }));
                commandsEmbed.addField(`${recipe.item.image} ${recipe.item.name}`, msg.join(`\n`));
            }
            return message.channel.send(commandsEmbed);
        }
        const recipeName = args.shift().toLowerCase();
        const amount = parseInt(args.shift()) || 1;
        const recipe = await Recipes.findOne({ include: { model: Items, as: 'item', where: {name: { [Op.iLike]: recipeName+'%' }}} });
        if(!recipe){
            const { prefix } = await Guildconfigs.get(message.guild.id);
            return message.channel.send(`That item doesn't exist.\nUse **_** instead of spaces. e.g tea_leaf`);
        }
        const user = await currency.getUser(message.author.id);
        const items = await user.getItems();
        const ids = items.map(i => i.item_id);
        const found = [];
        let missing = ``;
        for(const it of recipe.recipe){
            const pos = ids.indexOf(it.id);
            if(pos === -1){
                const item = await Items.findOne({ where: { id: it.id } });
                missing += `\n\n**${amount*it.amount}** - ${item.name} ${item.image}`;
                continue;
            }
            if(items[pos].amount >= amount*it.amount){
                found.push(items[pos]);
                continue;
            }
            missing += `\n\n**${amount*it.amount - items[pos].amount}** - ${items[pos].item.name} ${items[pos].item.image}`;
        }
        if(missing !== ``){
            const commandsEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic:true }))
                .addField(`You are missing:`, `${missing}`)
                .addField(`While trying to make:`, `**${amount}** - ${recipe.item.name} ${recipe.item.image}`);
            return message.channel.send(commandsEmbed);
        }
        for(const it of recipe.recipe){
            const item = found.shift();
            if (item.amount === it.amount*amount) await item.destroy();
            else {
                item.amount -= it.amount*amount;
                await item.save();
            }
        }
        await user.addItem(recipe.item, amount);
        return message.channel.send(`You've successfully made **${amount}** - ${recipe.item.name} ${recipe.item.image}`);
    }
}