const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays song from youtube')
		.addStringOption(option => option.setName('url')
			.setDescription('Youtube URL to play')
			.setRequired(true)),
	async execute(interaction) {
		const player = useMainPlayer();
		const channel = interaction.member.voice.channel;
		const urlToPlay = interaction.options.getString('url');

		await interaction.deferReply();

		if (!channel) {
			return await interaction.followUp('**You must be in a voice channel to play music!**')
		}

		try {
			const { track } = await player.play(channel, urlToPlay, {
				nodeOptions: {
					metadata: interaction,
				},
			});

			await interaction.followUp(`**${track.title} enqueued!**`);
		}
		catch (e) {
			await interaction.followUp(`Something broke: ${e}`);
		}
	},
};