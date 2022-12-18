const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(interaction) {
        let memberrole = interaction.guild.roles.cache.find(memberrole => memberrole.name === "Member");
        if (!memberrole) {
            try {
                memberrole = await interaction.guild.roles.create({
                    data:
                    {
                        name: 'Member',
                        color: '#95a5a6',
                        permissions: ['VIEW_CHANNEL']
                    }
                })
            } catch (e) {
                console.log(e);
            }
        }
        interaction.user.roles.add(memberrole);
    },
};