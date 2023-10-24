const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays song from youtube')
		.addStringOption(option => option.setName('url')
			.setDescription('Youtube URL to play')
			.setRequired(true)),
	async execute(interaction, client) {
		const guildQueue = client.player.hasQueue(interaction.guild.id);
		let queue;
		const urlToPlay = interaction.options.getString('url');

		if (!guildQueue) {
			queue = client.player.createQueue(interaction.guild.id);
			queue.skipVotes = [];
		}
		else {
			queue = client.player.getQueue(interaction.guild.id);
		}

		const channel = interaction.member.voice.channel;

		await queue.join(channel).catch((err) => {
			console.log(`Cound not join voice channel, Error: ${err.stack ? err + '\n\n' + err.stack : err.stack }`);
		});

		queue.textChannel = interaction.channel;

		const song = await queue.play(urlToPlay, { requestedBy: interaction.user }).catch((_, err) => {
			if (err) {
				console.log(err);
			}
			if (!queue) {
				queue.stop();
			}
		});
		if (!song) await interaction.reply('No track found!');

		await interaction.reply({ content: `Now playing: ${queue.nowPlaying}` });
	},
};