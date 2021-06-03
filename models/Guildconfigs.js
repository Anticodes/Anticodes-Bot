module.exports = (sequelize, DataTypes) => {
    return sequelize.define('guildconfigs', {
        guildId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        prefix: DataTypes.STRING,
        member: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },{
		timestamps: false,
	});
};