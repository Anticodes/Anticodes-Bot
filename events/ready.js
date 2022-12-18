const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const { Users, GuildConfigs } = await require('./utilities/dbObjects');
        
        const storedBalances = await Users.findAll();
        storedBalances.forEach(b => galobal.currency.set(b.user_id, b));

        const storedPrefixes = await GuildConfigs.findAll();
        storedPrefixes.forEach(p => global.Guildconfigs.set(p.guildId, p));

        client.user.setActivity("cnx help | Made by Antimax", { type: "PLAYING" });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};