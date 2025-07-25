const { getCommandLogObject, getAnalyticsLogObject, getConnectionStatus, getRateLimiter } = require('../helpers/database');


const ANALYTICS = process.env.ANALYTICS;

async function logCommand(interaction, error=false, errorMsg=null) {
	if (!getConnectionStatus()) {
		return;
	}
	if (ANALYTICS) {
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
}


async function logAnalytics(ping, userCount) {
	if (!getConnectionStatus()) {
		return;
	}
	if (ANALYTICS) {
		const analyticsLog = getAnalyticsLogObject();
		
		try {
			analyticsLog.create({
				latency: ping,
				user_count: userCount
			})
		}
		catch (err) {
			console.error('Failed to log analytics:', err);
		}
	}
}

module.exports = { logCommand, logAnalytics }