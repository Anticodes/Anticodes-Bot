const Discord = require("discord.js");

const infoText = (prefix) => {return `Artık hayali bir cennette yaşayan bir meleksin.
Asıl görevin olabildiğince çok tanrının sevgisini 'love' kazanıp "On Emir" arasındaki yerini almaya çalışmak, yani en iyi on melekten birisi olmak! **(${prefix} top)**
Para kazanmak için tanrıya yalvarabilir **(${prefix} beg)**, cenneteki ofiste çalışabilir **(${prefix} work)** ve daha fazlasını yapabilirsin!
Sonrasında bu para ile marketten **(${prefix} shop)** malzeme satın alıp **(${prefix} buy)**, bu malzemeleri birleştirerek **(${prefix} make)** yeni eşyalar üretebilirsin!
Bu ürettiğin eşyaların bazı özellikleri var, mesela bunları birisine hediye ederek **(${prefix} give)** tanrının sevgisini kazanabilirsin!
Eğer komutları nasıl kullanacağın hakkında bilgi almak istersen **(${prefix} help <komut ismi>)** komudunu kullanabilirsin!`;
};

module.exports = {
    name: 'bilgi',
    aliases: ['infotr'],
    desc: 'Oyun hakkında bilgi verir.',
    dir: 'game',
    guildOnly: false,
    cooldown: 5,
    async execute (message, args) {
        const commandsEmbed = new Discord.MessageEmbed();
        let guildPrefix;
        try{
            const { prefix } = await Guildconfigs.get(message.guild.id);
            guildPrefix = prefix;
        }catch(e){
            guildPrefix = defaultPrefix;
        }
        commandsEmbed
            .setColor('#0099ff')
            .setTitle('Oyun hakkında bilgi')
            .setDescription(infoText(guildPrefix))
            .setTimestamp();
        message.channel.send(commandsEmbed);
    }
}