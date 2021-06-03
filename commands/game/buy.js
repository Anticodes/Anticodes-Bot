const { Shop, Items } = require('../../utilities/dbObjects');
const { Op } = require('sequelize');

module.exports = {
    name: 'buy',
    desc: 'Buys an item from the shop if user has enough money.',
    dir: 'game',
    args: true,
    usage: '[amount] <item name>',
    guildOnly: true,
    async execute (message, args) {
        const amount = args.length > 1 ? (parseInt(args.shift()) || 1) : 1;
        if (amount <= 0) return message.reply(`please enter an amount greater than zero!`);
        const name = args.shift();
        const item = await Shop.findOne({ include: { model: Items, as: 'item', where: { name: { [Op.iLike]: name+'%' } } } });
        if (!item){
            const { prefix } = await Guildconfigs.get(message.guild.id);
            return message.channel.send(`That item doesn't exist. Use **_** instead of spaces. e.g tea_leaf.\nProper usage is \`${prefix}${this.name} ${this.usage}\``);
        }
        const totalCost = item.cost*amount;
        if (totalCost > currency.getBalance(message.author.id)) {
            return message.channel.send(`You currently have **${currency.getBalance(message.author.id)}** <a:money:805767768712544266> , but **${amount}** ${item.item.name} ${item.item.image} costs **${totalCost}** <a:money:805767768712544266>!`);
        }

        const user = await currency.getUser(message.author.id);
        currency.addBalance(message.author.id, -totalCost);
        await user.addItem(item.item, amount);

        return message.channel.send(`You've bought: **${amount}** ${item.item.name} ${item.item.image}.`);
    }
}