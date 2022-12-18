const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("skip")
        .setNameLocalization("tr", "atla")
        .setDescription("Skips the song and continues from the queue")
        .setDescriptionLocalization("tr", "Şarkıyı atlar ve sıradaki şarkıdan devam eder")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["skip"]);
    }
}