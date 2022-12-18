const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Discord = require("discord.js");

const option = (number, required) => {
    return (option) => {
        const opt = option
            .setName("option" + number)
            .setNameLocalization("tr", "seçenek" + number)
            .setDescription("Emoji and explanation; 😂 Laughing explanation")
            .setDescriptionLocalization("tr", "Emoji ve açıklama; 😂 Gülen açıklama");
        if (required) return opt.setRequired(true);
        else return opt;
    }
}

module.exports = {
    dir: 'social',
    data: new SlashCommandBuilder()
        .setName("poll")
        .setNameLocalization("tr", "anket")
        .setDescription(`Creates a poll with given arguments.Example;\n/poll title: How was your day? option1: 😂 Great option2: 🙂 Fine option3: 😐 Decent option4: 😞 Bad\n/poll title: Which one is your favorite animal? option1: 🐈 Cat option2: 🐕 Dog`)
        .setDescriptionLocalization("tr", `Verilen argümanlar ile bir anket oluşturur.Örnek;\ncnx anket "Günün nasıl geçti ? " 😂 "Harika" 🙂 "Güzel" 😐 "Orta" 😞 "Kötü"\ncnx anket "En sevdiğin hayvan hangisi ? " 🐈 "Kedi" 🐕 "Köpek"`)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => option
            .setName("title")
            .setNameLocalization("tr", "başlık")
            .setRequired(true)
        )
        .addStringOption(option(1, true)).addStringOption(option(2)).addStringOption(option(3)).addStringOption(option(4)).addStringOption(option(5))
        .addStringOption(option(6)).addStringOption(option(7)).addStringOption(option(8)).addStringOption(option(9)).addStringOption(option(10)),
    async execute(interaction) {
        const title = interaction.options.getString("title");
        const strs = await arguments.match(/"[^"]+"|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])|<a?:.+:\d+>/g);
        let desc = ``;
        let emojis = [];
        for (let i = 1; i < 11; i++) {
            const option = interaction.options.getString("option" + i);
            if (!option) continue;
            const [emoji, ...rest] = option.split(" ");
            if (rest.length < 1) continue;
            desc += `\n ${option}\n`;
            emojis.push(emoji); 
        }
        if (!desc.length) return message.reply(`proper usage is \`${prefix}${this.name} ${this.usage}\``);
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            .setDescription(desc);
        message.delete({ timeout: 2000 });
        return message.channel.send(commandsEmbed)
            .then(async (msg) => {
                for (let i = 0; i < emojis.length; i++) {
                    try {
                        await msg.react(emojis[i]);
                    } catch (e) {
                        msg.delete();
                        return message.channel.send(`You either didn't send an emoji or i can't access that emoji!`)
                    }
                }
            })
    }
}