const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("resume")
        .setNameLocalization("tr", "devam")
        .setDescription("Resumes the song that has been paused")
        .setDescriptionLocalization("tr", "Duraklatılan şarkıya devam eder")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["resume"]);
    }
}