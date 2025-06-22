const { Events, MessageFlags } = require('discord.js');
const { logCommand } = require('../helpers/analytics');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction, interaction.client);
				logCommand(interaction);
			}
			catch (error) {
				console.error(error);
				logCommand(interaction, true, error);
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}

		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.autocomplete(interaction);
			}
			catch (e) {
				console.error(`Something happened when trying to autocomplete: ${e.message}`);
				return;
			}
		}
	},
};