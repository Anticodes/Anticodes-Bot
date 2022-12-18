const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("join")
        .setNameLocalization("tr", "katıl")
        .setDescription("Makes the bot join the channel that you're currently in")
        .setDescriptionLocalization("tr", "Bot bulunduğunuz kanala katılır")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["join"]);
    }
}