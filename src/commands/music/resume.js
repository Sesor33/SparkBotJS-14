const { SlashCommandBuilder } = require('discord.js');
const { useTimeline } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes current song'),
	async execute(interaction) {
		await interaction.deferReply();

		const timeline = useTimeline(interaction.guildId);

		if (!timeline?.track) {
			return await interaction.followUp('Nothing is playing.');
		}

		if (!timeline.paused) {
			return await interaction.followUp(`**${timeline.track.title}** is not paused.`);
		}

		timeline.resume();

		return await interaction.followUp(`Resumed **${timeline.track.title}**`);
	},
};
