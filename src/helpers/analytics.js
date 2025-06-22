const { getCommandLogObject, getConnectionStatus, getRateLimiter } = require('../helpers/database');


async function logCommand(interaction, error=false, errorMsg=null) {
	if (!getConnectionStatus()) {
		// guard statement
		return;
	}

	const commandLog = getCommandLogObject() // get the model for command logs
	const commandId = interaction.commandId;
	const guildId = interaction.guildId;
	const channelId = interaction.channelId;
	const timestamp = Date.now();

	try {
		await commandLog.create({
				command_id: commandId,
				channel_id: channelId,
				guild_id: guildId,
				timestamp: timestamp,
				error: error,
				error_msg: errorMsg
		});
	} catch (err) {
			console.error('Failed to log command:', err);
	}
  
}

module.exports = { logCommand }