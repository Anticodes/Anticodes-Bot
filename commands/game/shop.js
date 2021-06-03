const { Shop } = require('../../utilities/dbObjects');

module.exports = {
    name: 'shop',
    desc: 'Displays the shop screen.',
    dir: 'game',
    args: false,
    guildOnly: true,
    cooldown: 20,
    async execute (message, args) {
        const items = await Shop.findAll({ include: ['item'] });
        return message.channel.send(items.map(item => `${item.item.image}| ${item.item.name}: **${item.cost}** <a:money:805767768712544266>`).join('\n'));
    }
}