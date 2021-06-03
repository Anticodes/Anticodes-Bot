module.exports = (sequelize, DataTypes) => {
	return sequelize.define('items', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        item_type: {
            type: DataTypes.STRING,
            allowNull: false,
        }
	}, {
		timestamps: false,
	});
};