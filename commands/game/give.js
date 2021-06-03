const { UserItems, Items } = require('../../utilities/dbObjects');
const { Op } = require('sequelize');

module.exports = {
    name: 'give',
    aliases: ['gift', 'send'],
    desc: 'Gives money to the mentioned user.',
    dir: 'game',
    args: true,
    usage: '<mention> [amount] <money|item name>',
    guildOnly: true,
    cooldown: 60,
    async execute (message, args) {
        const transferTarget = message.mentions.users.first();args.shift();
        const { prefix } = await Guildconfigs.get(message.guild.id);
        if (!transferTarget) return message.reply(`you need to mention someone!\nProper usage is \`${prefix}${this.name} ${this.usage}\``);
        if (transferTarget.id === message.author.id) return message.reply(`you can't gift to yoursel!`);
        const transferAmount = args.length > 1 ? parseInt(args.shift()) : 1;
        if (isNaN(transferAmount)) return message.reply(`that's an invalid amount!\nProper usage is \`${prefix}${this.name} ${this.usage}\``);
        if (transferAmount <= 0) return message.reply(`please enter an amount greater than zero!`);
        if (!args.length) return message.channel.send(`Proper usage is \`${prefix}${this.name} ${this.usage}\``);
        const transferItem = args.shift().toLowerCase();
        if(transferItem === 'money'){
            const currentAmount = currency.getBalance(message.author.id);
            if (transferAmount > currentAmount) return message.reply(`you only have **${currentAmount}** <a:money:805767768712544266>.`);

            await currency.addBalance(message.author.id, -transferAmount);
            await currency.addBalance(transferTarget.id, transferAmount);

            return message.channel.send(`Successfully transferred **${transferAmount}** <a:money:805767768712544266> to **${transferTarget.username}**.\nYour current balance is **${currency.getBalance(message.author.id)}** <a:money:805767768712544266>`);
        }
        const item = await UserItems.findOne({ where: { user_id: message.author.id }, include: { model: Items, as: 'item', where: {name: { [Op.iLike]: transferItem+'%' }}}});
        if(!item) return message.reply(`can't find that item in your inventory! Use **_** instead of spaces. e.g tea_leaf\nProper usage is \`${prefix}${this.name} ${this.usage}\``);
        if (transferAmount > item.amount) return message.reply(`you only have **${item.amount}** ${item.item.name} ${item.item.image}.`);
        const user = await currency.getUser(transferTarget.id);
        await user.addItem(item.item, transferAmount);
        if (transferAmount === item.amount) await item.destroy();
        else {
            item.amount -= transferAmount;
            await item.save();
        }
        return message.channel.send(`Successfully transferred **${transferAmount}** ${item.item.name} ${item.item.image} to **${transferTarget.username}**.`);
    }
}