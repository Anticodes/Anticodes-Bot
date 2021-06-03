const { Users } = require('../../../utilities/dbObjects');

module.exports = {
    name: 'edituser',
    desc: 'Secret Command',
    dir: 'game/hack',
    args: true,
    async execute (message, args){
        if(message.author.id != process.env.DEVID) return;
        const userId = args.shift();
        const type = args.shift().toLowerCase();
        const opr = args.shift().toLowerCase();
        const amount = parseInt(args[0]);
        switch(type){
            case 'money':{
                switch(opr){
                    case 'set':
                        currency.setBalance(userId, amount);
                        return message.channel.send(`Changed the balance of <@${userId}> to ${amount} <a:money:805767768712544266>`);
                    case 'add':
                        currency.addBalance(userId, amount);
                        return message.channel.send(`Added ${amount} <a:money:805767768712544266> to the balance of <@${userId}>`);
                }
            }
            case 'love':{
                switch(opr){
                    case 'set':
                        currency.setLove(userId, amount);
                        return message.channel.send(`Changed the love of <@${userId}> to ${amount} ❤`);
                    case 'add':
                        currency.addLove(userId, amount);
                        return message.channel.send(`Added ${amount} ❤ to the love of <@${userId}>`);
                }
            }
        }
    }
}