const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("queue")
        .setNameLocalization("tr", "sira")
        .setDescription("Displays the current songs in the queue")
        .setDescriptionLocalization("tr", "Sırada bulunan şarkıları gösterir")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["queue"]);
    }
}