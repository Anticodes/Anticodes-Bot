module.exports = {
    name: 'beg',
    aliases: ['b'],
    desc: 'Begs to the god and asks for money.',
    dir: 'game',
    args: false,
    guildOnly: true,
    cooldown: 5,
    async execute (message, args) {
        const mood = Math.random();
        if(mood < 0.5){
            const amount = Math.floor(Math.random() * 10) + 1;
            currency.addBalance(message.author.id, amount);
            return message.channel.send(`God is happy and answered your call!\nYou've got **${amount}** <a:money:805767768712544266>`);
        }else{
            const amount = Math.floor(Math.random() * 5) + 1;
            const balance = currency.getBalance(message.author.id);
            const Amount = (balance > amount ? amount : balance);
            if(Amount < 1){
                return message.channel.send(`God was angry until he saw how poor you are!`);
            }
            currency.addBalance(message.author.id, -Amount);
            return message.channel.send(`God is angry and gave you a punishment!\nGod took **${Amount}** <a:money:805767768712544266> from you!`);
        }
    }
}