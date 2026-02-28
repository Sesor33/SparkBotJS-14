const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getDBObject, getConnectionStatus, getRateLimiter } = require('../../helpers/database');
const { logCommand } = require('../../helpers/analytics');
const argon2 = require('argon2');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('passphrase')
		.setDescription('Sets a passphrase for a role and listens for channels')
		.addStringOption(option =>
			option.setName('phrase')
				.setDescription('Passphrase to authenticate with')
				.setRequired(true)),

	async execute(interaction) {
		// ensure DB is connected before proceeding
		if (!getConnectionStatus()) {
			return await interaction.followUp('Database is not connected!');
		}

		// get relevant data
		const phrase = interaction.options.getString('phrase');
		const guildId = interaction.guildId;
		const channelId = interaction.channelId;
		const userId = interaction.userId;
		const passphrase = getDBObject('passphrase');
		const rateLimiter = getRateLimiter();

		try {
			// check rate limit
			await rateLimiter.consume(userId);

			// checking if guild/channel combo already exists
			const existingHash = await passphrase.findOne({
				where : {
					guild_id : guildId,
					channel_id : channelId,
				},
			});

			// if it does, check auth with argon2
			if (existingHash && existingHash.channel_id === channelId) {
				if (await argon2.verify(existingHash.phrase, phrase)) {
					interaction.member.roles.add(existingHash.role_id, 'User properly authenticated');
					return await interaction.reply({ content: 'Authenticated!', flags: MessageFlags.Ephemeral });
				}
				else {
					return await interaction.reply({ content: 'Incorrect passphrase', flags: MessageFlags.Ephemeral });
				}
			}
			else {
				// no auth exists on channel
				return await interaction.reply({ content: 'No auth is set on for this channel', flags: MessageFlags.Ephemeral });
			}
		}
		catch (err) {
			// rate limited
			logCommand(interaction, true, err.message);
			return await interaction.reply({ content: 'Too many requests, please wait a few seconds and try again.', flags: MessageFlags.Ephemeral });
		}
	},
};