const papers = require('./papers.json');

module.exports = {
    name: 'work',
    aliases: ['w', 'office'],
    desc: 'Begs to the god and asks for money.',
    dir: 'game',
    args: false,
    guildOnly: true,
    cooldown: 60,
    async execute (message, args) {
        const paper = papers[Math.floor(Math.random() * papers.length)];
        const filter = response => {
            const content = response.content.toLowerCase();
            return response.author.id === message.author.id && (content === 'heaven' || content === "hell");
        };
        message.channel.send(paper.sentence).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    const msg = collected.first();
                    if(paper.answer === msg.content.toLowerCase()){
                        if(paper.answer === 'heaven'){
                            currency.addPrayer(message.author.id, 1);
                            currency.addBalance(message.author.id, 100);
                            return message.channel.send(`${msg.author} has done the right thing! Also ${paper.gender ? 'she' : 'he'} wants to be your follower!\nYou got a **Follower** and **100** <a:money:805767768712544266>`);
                        }else {
                            currency.addBalance(message.author.id, 100);
                            return message.channel.send(`${msg.author} brought ${paper.gender ? 'her' : 'him'} to justice!\nYou sent ${paper.gender ? 'her' : 'him'} to hell for ${paper.gender ? 'her' : 'his'} sins and got **100** <a:money:805767768712544266>`);
                        }
                    }else {
                        if(paper.answer === 'heaven'){
                            return message.channel.send(`${msg.author} has sent the wrong person to hell!\n${paper.gender ? 'She' : 'He'} wasn't that bad.`);
                        }else {
                            if(currency.getLove(message.author.id)){
                                currency.addLove(message.author.id, -1);
                                return message.channel.send(`${msg.author} has let the wrong person to get into heaven!\nThe god is disappointed and you lost god's love 💔.`);
                            }else {
                                return message.channel.send(`${msg.author} has let the wrong person to get into heaven!\nThe god is disappointed in you.`);
                            }
                        }
                    }
                })
                .catch(() => {
                    return message.channel.send(`Looks like ${message.author} has no clue about this situation.`);
                });
        });
    }
}