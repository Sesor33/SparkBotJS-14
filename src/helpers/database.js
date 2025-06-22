const { Sequelize, DataTypes } = require('@sequelize/core');
const { MySqlDialect } = require('@sequelize/mysql');
const { RateLimiterMemory } = require('rate-limiter-flexible');
require('dotenv').config(); // getting environment variables

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = 'localhost';
const dbPort = 3306;
const analytics = process.env.ANALYTICS;

let sequelize;
let passphrase;
let commandLog;
let rateLimiter;
let isConnected = false;
let tables = [];


async function initializeDatabase() {
	if (!dbName || !dbUsername || !dbPassword) {
		// Theres nothing here, quit out
		return;
	}

	// create rate limiter object
	rateLimiter = new RateLimiterMemory({
		points : 1,
		duration : 10
	});

	// create a new sequelize instance
	sequelize = new Sequelize({
		dialect : MySqlDialect,
		database : dbName,
		user : dbUsername,
		password : dbPassword,
		host : dbHost,
		port : dbPort
	});
	
	try {
		await sequelize.authenticate();
		console.log('DB Connection successful!');
	} catch (err) {
		console.error('Arrr, we have a problem with the connection. No DB today it seems');
	}

	passphrase = sequelize.define('passphrase', {
		guild_id: {
			type : DataTypes.STRING,
			allowNull : false
		},
		channel_id: {
			type : DataTypes.STRING,
			allowNull : false
		},
		phrase: {
			type : DataTypes.STRING,
			allowNull : false
		},
		role_id: {
			type : DataTypes.STRING,
			allowNull : false
		},
	}, {
		paranoid : true
	});

	tables.push(passphrase);

	if (analytics) {
		commandLog = sequelize.define('commandlog', {
			command_id: {
				type : DataTypes.STRING,
				allowNull : false
			},
			channel_id: {
				type : DataTypes.STRING,
				allowNull : false
			},
			guild_id: {
				type : DataTypes.STRING,
				allowNull : false
			},
			timestamp: {
				type : DataTypes.DATE,
				allowNull : false
			},
			error: {
				type : DataTypes.BOOLEAN,
				allowNull : false
			},
			error_msg: {
				type : DataTypes.STRING,
				allowNull : true
			},
		}, {
			paranoid : true
		});

		tables.push(commandLog)
	}

	// attempt to sync all tables in the list
	try {
		for (let table of tables) {
			await table.sync();
		}
		isConnected = true;
		console.log('Table sync successful!');
	} catch (err) {
		console.log('Table did not sync properly: ', err);
	}
}


function getPassphraseObject() {
	return passphrase;
}

function getCommandLogObject() {
	return commandLog;
}


function getConnectionStatus() {
	return isConnected;
}


function getRateLimiter() {
	return rateLimiter;
}

module.exports = { initializeDatabase, getPassphraseObject, getCommandLogObject, getConnectionStatus, getRateLimiter };