const { Sequelize, DataTypes } = require('@sequelize/core');
const { MySqlDialect } = require('@sequelize/mysql');
const { RateLimiterMemory } = require('rate-limiter-flexible');
// getting environment variables
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = 'localhost';
const dbPort = 3306;
const analytics = process.env.ANALYTICS;
const dbObjects = {};

let sequelize;
let passphrase;
let commandLog;
let analyticsLog;
let rateLimiter;
let isConnected = false;

// async delay in case of docker
function delayConnection(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function initializeDatabase(delayMs = 10000) {
	if (!dbName || !dbUsername || !dbPassword) {
		// Theres nothing here, quit out
		return;
	}

	await delayConnection(delayMs);
	// create rate limiter object
	rateLimiter = new RateLimiterMemory({
		points : 1,
		duration : 10,
	});

	// create a new sequelize instance
	sequelize = new Sequelize({
		dialect : MySqlDialect,
		database : dbName,
		user : dbUsername,
		password : dbPassword,
		host : dbHost,
		port : dbPort,
	});

	try {
		await sequelize.authenticate();
		console.log('DB Connection successful!');
	}
	catch (err) {
		console.error('ERROR: Could not connect to DB. Is it up?');
	}

	passphrase = sequelize.define('passphrase', {
		guild_id: {
			type : DataTypes.STRING,
			allowNull : false,
		},
		channel_id: {
			type : DataTypes.STRING,
			allowNull : false,
		},
		phrase: {
			type : DataTypes.STRING,
			allowNull : false,
		},
		role_id: {
			type : DataTypes.STRING,
			allowNull : false,
		},
	}, {
		paranoid : true,
	});
	dbObjects.passphrase = passphrase;


	if (analytics) {
		console.log('Analytics enabled');
		commandLog = sequelize.define('commandlog', {
			command_id: {
				type : DataTypes.STRING,
				allowNull : false,
			},
			channel_id: {
				type : DataTypes.STRING,
				allowNull : false,
			},
			guild_id: {
				type : DataTypes.STRING,
				allowNull : false,
			},
			timestamp: {
				type : DataTypes.DATE,
				allowNull : false,
			},
			error: {
				type : DataTypes.BOOLEAN,
				allowNull : false,
			},
			error_msg: {
				type : DataTypes.STRING,
				allowNull : true,
			},
		}, {
			paranoid : true,
		});
		dbObjects.commandlog = commandLog;

		analyticsLog = sequelize.define('analyticslog', {
			latency: {
				type : DataTypes.INTEGER,
				allowNull : true,
			},
			user_count: {
				type : DataTypes.INTEGER,
				allowNull : false,
			},
			timestamp: {
				type : DataTypes.DATE,
				allowNull : false,
			},
		}, {
			paranoid : true,
		});
		dbObjects.analyticslog = analyticsLog;
	}

	// attempt to sync all tables in the list
	try {
		// for (const table of Object.values(dbObjects)) {
		// 	await table.sync();
		// }
		await sequelize.sync({ alter: true });
		isConnected = true;
		console.log('Table sync successful!');
	}
	catch (err) {
		console.log('Table did not sync properly: ', JSON.stringify(err, null, 4));
	}
}


function getConnectionStatus() {
	return isConnected;
}

function getDBObject(tableName) {
	if (tableName in dbObjects) {
		return dbObjects[tableName];
	}
	else {
		console.error('Invalid table name: ' + tableName);
		return null;
	}
}

function getRateLimiter() {
	return rateLimiter;
}

module.exports = { initializeDatabase, getDBObject, getConnectionStatus, getRateLimiter };