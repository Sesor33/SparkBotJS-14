const { SlashCommandBuilder } = require('discord.js');
const { useTimeline } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Sets the volume to a selected value')
        .addNumberOption(option => option.setName('volume')
            .setDescription('Volume to set playback to')
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)),
	async execute(interaction) {
        const volume = interaction.options.getNumber('volume');

		await interaction.deferReply();

		const timeline = useTimeline(interaction.guildId);

		if (!timeline?.track) {
			return await interaction.followUp('Nothing is playing.');
		}

		timeline.setVolume(volume)

		return await interaction.followUp(`Set volume to **${volume}**`);
	},
};
