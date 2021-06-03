const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}
});

const itemList = require('../commands/game/items/items.json');

const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);
const Shop = require('../models/Shop')(sequelize, Sequelize.DataTypes);
const Items = require('../models/Items')(sequelize, Sequelize.DataTypes);
const Recipes = require('../models/Recipes')(sequelize, Sequelize.DataTypes);
const UserItems = require('../models/UserItems')(sequelize, Sequelize.DataTypes);
const GuildConfigs = require('../models/Guildconfigs')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });
Recipes.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });
Shop.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });

sequelize.sync().then(async () => {
	//sequelize.query('ALTER TABLE guildconfigs ADD member BOOLEAN DEFAULT FALSE;');
	const items = itemList.map(i => Items.upsert({ id: i.id, name: i.name, image: i.image, item_type: i.item_type }));
	await Promise.all(items);
	const shopItems = itemList.filter(i => i.cost).map(i => Shop.upsert({ item_id: i.id, cost: i.cost }));
	await Promise.all(shopItems);
	const recipes = itemList.filter(i => i.recipe).map(i => Recipes.upsert({ item_id: i.id, recipe: i.recipe }));
	await Promise.all(recipes);
	console.log('Database synced');
}).catch(console.error);

/* eslint-disable-next-line func-names */
Users.prototype.addItem = async function(item, amt = 1) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
		userItem.amount += Number(amt);
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: Number(amt) });
};

/* eslint-disable-next-line func-names */
Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

Reflect.defineProperty(Guildconfigs, 'setPrefix', {
	value: async function setPrefix(id, value) {
		const config = Guildconfigs.get(id);
		if (config) {
			config.prefix = value;
			return config.save();
		}
		const newPrefix = await GuildConfigs.create({ guildId: id, prefix: value });
		Guildconfigs.set(id, newPrefix);
		return newPrefix;
	},
});

Reflect.defineProperty(Guildconfigs, 'setMember', {
	value: async function setMember(id, value) {
		const config = Guildconfigs.get(id);
		if (config) {
			config.member = value;
			return config.save();
		}
		const newMember = await GuildConfigs.create({ guildId: id, prefix: defaultPrefix, member: value });
		Guildconfigs.set(id, newMember);
		return newMember;
	},
});

Reflect.defineProperty(currency, 'setPrayer', {
	value: async function setPrayer(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.prayer = amount;
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, prayer: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'addPrayer', {
	value: async function addPrayer(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.prayer += amount;
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, prayer: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getPrayer', {
	value: function getPrayer(id) {
		const user = currency.get(id);
		return user ? user.prayer : 0;
	},
});

Reflect.defineProperty(currency, 'setLove', {
	value: async function setLove(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.love = amount;
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, love: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'addLove', {
	value: async function addLove(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.love += amount;
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, love: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getLove', {
	value: function getLove(id) {
		const user = currency.get(id);
		return user ? user.love : 0;
	},
});

Reflect.defineProperty(currency, 'setBalance', {
	value: async function setBalance(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance = amount;
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'addBalance', {
	value: async function addBalance(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += amount;
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

Reflect.defineProperty(currency, 'getUser', {
	value: async function getUser(id) {
		const user = currency.get(id);
		if(user) return user;
		const newUser = await Users.create({ user_id: id });
		currency.set(id, newUser);
		return newUser;
	},
});

module.exports = { Users, Shop, UserItems, GuildConfigs, Recipes, Items };