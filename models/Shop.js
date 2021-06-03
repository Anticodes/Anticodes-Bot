module.exports = (sequelize, DataTypes) => {
	return sequelize.define('shop_item', {
		item_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	}, {
		timestamps: false,
	});
};