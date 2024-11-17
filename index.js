// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Embed } = require('discord.js');
require('dotenv').config(); // getting environment variables
const token = process.env.DISCORD_TOKEN;
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { EmbedBuilder } = require('discord.js');

// music player declaration
const { Player } = require('discord-player');

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

// create new Player instance for music functions
const player = new Player(client);

// Load default extractors except YoutubeExtractor
player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor'); // YoutubeExtractor is broken, use YoutubeiExtractor
player.extractors.register(YoutubeiExtractor, {});

// handle command files
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'src/commands');
const commandFolders = fs.readdirSync(foldersPath);

// check folders for commands
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// handle event files
const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		console.log(event.name);
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// handle player and notify user
player.events.on('playerStart', (queue, track) => {

	const songEmbed = new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(track.title)
		.setURL(track.url)
		.setAuthor({name: client.user.username, iconURL: client.user.avatarURL()})
		.setDescription(track.description)
		.setThumbnail(track.thumbnail)
		.setTimestamp()
		.addFields(
			{ name: 'Duration', value: track.duration, inline: true },
			{ name: 'Views', value: track.views.toString(), inline: true },
		);
		queue.metadata.channel.send({ embeds: [songEmbed] });
});

// Login to Discord with your client's token
client.login(token);