const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses current song'),
	async execute(interaction, client) {
		let queue;
		const guildQueue = client.player.hasQueue(interaction.guild.id);

		if (guildQueue) {
			queue = client.player.getQueue(interaction.guild.id);
			queue.setPaused(true);
			await interaction.reply({ content: `Paused ${guildQueue.nowPlaying}` });
		}
		else {
			await interaction.reply({ content: 'Nothing is playing' });
		}

	},
};