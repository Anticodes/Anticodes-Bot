const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("pause")
        .setNameLocalization("tr", "duraklat")
        .setDescription("Pauses the song until a resume command")
        .setDescriptionLocalization("tr", "Şarkıyı devam komudu gelene kadar duraklatır")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["pause"]);
    }
}