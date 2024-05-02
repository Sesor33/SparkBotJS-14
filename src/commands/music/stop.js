const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops current song'),
	async execute(interaction) {
		await interaction.deferReply();

		const queue = useQueue(interaction.guildId);

		if (!queue?.isPlaying()) {
			return await interaction.followUp('Nothing is playing.');
		}

		queue.node.stop();

		return await interaction.followUp('Stopped track.');
	},
};
