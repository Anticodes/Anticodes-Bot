const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("loop")
        .setNameLocalization("tr", "tekrar")
        .setDescription("Loops the current song")
        .setDescriptionLocalization("tr", "Çalan şarkıyı tekrar eder")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["loop"]);
    }
}