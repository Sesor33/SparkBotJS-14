const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('progressbar')
		.setDescription('Prints a progress bar of the current song'),
	async execute(interaction, client) {
		let queue;
		const guildQueue = client.player.hasQueue(interaction.guild.id);

		if (guildQueue) {
			queue = client.player.getQueue(interaction.guild.id);
			const progressBar = queue.createProgressBar();
			await interaction.reply({ content: `Current Song: ${queue.nowPlaying}\n${progressBar.prettier}` });
		}
		else {
			await interaction.reply({ content: 'Nothing is playing' });
		}

	},
};