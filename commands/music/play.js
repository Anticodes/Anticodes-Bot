const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("play")
        .setNameLocalization("tr", "oynat")
        .setDescription("Plays the song either with a link or a search term")
        .setDescriptionLocalization("tr", "Bir link veya arama terimiyle şarkı oynatır")
        .setDMPermission(false)
        .addStringOption(option => option
            .setName("search")
            .setNameLocalization("tr", "terim")
            .setDescription("Search term or a link")
            .setDescriptionLocalization("tr", "Arama terimi veya bir link")
            .setRequired(true)
        ),
    async execute(interaction) {
        music.execute(interaction, ["play", interaction.options.getString("search")]);
    }
}