const { Events } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { getUserCount, getPing } = require('../helpers/util.js');
const { logAnalytics } = require('../helpers/analytics.js');

const PLAYER = useMainPlayer();
const DEBUG = process.env.DEBUG;
const ANALYTICS = process.env.ANALYTICS;
const ANALYTICS_INTERVAL = 600000;

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		if (DEBUG) {
			console.log(PLAYER.scanDeps);
			PLAYER.events.on('error', (_, err) => console.log(err));
			PLAYER.events.on('playerError', (_, err) => console.log(err));

			PLAYER.events.on('debug', (_, msg) => console.log(msg));
			PLAYER.on('debug', (msg) => console.log(msg));
		}

		if (ANALYTICS) {
			setInterval(() => {
				logAnalytics(getPing(client), getUserCount(client));
			}, ANALYTICS_INTERVAL);
		}

		console.log(`Ready! Logged in as ' ${client.user.tag}`);
	},
};