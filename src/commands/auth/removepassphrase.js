const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getPassphraseObject, getConnectionStatus } = require('../../helpers/database');
const { debugLog } = require('../../helpers/util');
const { logCommand } = require('../../helpers/analytics');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removepassphrase')
		.setDescription('Removes the passphrase/role association for the selected channel')
		.addChannelOption(option =>
			option.setName('channel')
			.setDescription('Channel to remove passphrase from')
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
	async execute(interaction, client) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })
		// ensure DB is connected before proceeding
		if (!getConnectionStatus()) {
			return await interaction.followUp('Database is not connected!');
		}

		// get relevant data
		const channelId = interaction.options.getChannel('channel').id;
		const channelName = interaction.options.getChannel('channel').name
		const guildId = interaction.guildId;
		const passphrase = getPassphraseObject();
		
		try {
			// Checking if guild/channel combo already exists
			existingHash = await passphrase.findOne({
				where : {
					guild_id : guildId,
					channel_id : channelId
				}
			});

			// delete if exists
			if (existingHash) {
				debugLog('Existing value found, deleting');
				await passphrase.destroy({
					where : {
						guild_id : guildId,
						channel_id : channelId
					},
				});
			}

			// ignore if doesn't exist
			else {
				debugLog('Didn\'t find a value, doing nothing');
				return await interaction.followUp({ content: `No existing passphrases for channel: ${channelName}` })
			}
		} catch (err) {
			logCommand(interaction, true, err.message);
			return await interaction.followUp(`Something broke: ${err.message}`);
		}

		return await interaction.followUp({ content: `Successfully removed passphrase from channel: ${channelName}` });
	},
}