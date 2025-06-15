const { Events } = require('discord.js');
const { useMainPlayer } = require("discord-player");

const player = useMainPlayer();

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		let debug = false;
		if (process.env.DEBUG) {
			debug = process.env.DEBUG.toLowerCase() == 'debug' ? true : false; // debug set?
		}

		if (debug) {
			console.log(player.scanDeps);
	
			player.events.on("error", (_, err) => console.log(err));
			player.events.on("playerError", (_, err) => console.log(err));
	
			player.events.on("debug", (_, msg) => console.log(msg));
			player.on("debug", (msg) => console.log(msg));
		}
		
		console.log(`Ready! Logged in as ' ${client.user.tag}`);
	},
};