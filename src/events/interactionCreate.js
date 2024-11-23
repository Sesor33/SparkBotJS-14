const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		console.log('now interacting');
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction, interaction.client);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;
			
			try {
				console.log('attempting to autocomplete');
				await command.autocomplete(interaction);
			}
			catch (e) {
				console.error(`Something happened when trying to autocomplete: ${e.message}`);
				return;
			}
		}

		
	},
};