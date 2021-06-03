module.exports = (sequelize, DataTypes) => {
	return sequelize.define('recipes', {
		item_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
		recipe: {
			type: DataTypes.STRING,
            allowNull: false,
            get() {
                return JSON.parse(this.getDataValue('recipe'));
            }, 
            set(val) {
                this.setDataValue('recipe', JSON.stringify(val));
            }
		}
	}, {
		timestamps: false,
	});
};