const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops current song'),
	async execute(interaction, client) {
		let queue;
		const guildQueue = client.player.hasQueue(interaction.guild.id);

		if (guildQueue) {
			queue = client.player.getQueue(interaction.guild.id);
			queue.stop();
			await interaction.reply({ content: `Stopped Song: ${queue.nowPlaying}` });
		}
		else {
			await interaction.reply({ content: 'Nothing is playing' });
		}

	},
};