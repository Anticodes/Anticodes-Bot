const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("leave")
        .setNameLocalization("tr", "ayrıl")
        .setDescription("Makes the bot leave the channel that you're in")
        .setDescriptionLocalization("tr", "Bot bulunduğunuz kanaldan ayrılır")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["leave"]);
    }
}