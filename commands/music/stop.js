const { SlashCommandBuilder } = require('discord.js');
const music = require('../../helpers/music.js');

module.exports = {
    dir: 'music',
    data: new SlashCommandBuilder()
        .setName("stop")
        .setNameLocalization("tr", "dur")
        .setDescription("Stops the song, empties the queue and leaves the voice chat")
        .setDescriptionLocalization("tr", "Şarkıyı durdurur, sırayı boşaltır ve kanaldan ayrılır")
        .setDMPermission(false),
    async execute(interaction) {
        music.execute(interaction, ["stop"]);
    }
}