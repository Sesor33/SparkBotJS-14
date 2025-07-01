const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getPassphraseObject, getConnectionStatus } = require('../../helpers/database');
const { debugLog } = require('../../helpers/util');
const { logCommand } = require('../../helpers/analytics');
const argon2 = require('argon2');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('setpassphrase')
		.setDescription('Sets a passphrase for a role and listens for channels')
		.addStringOption(option =>
			option.setName('phrase')
			.setDescription('Passphrase needed to access')
			.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
			.setDescription('Channel to listen in')
			.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
			.setDescription('Role that will be assigned')
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })
		// ensure DB is connected before proceeding
		if (!getConnectionStatus()) {
			return await interaction.followUp('Database is not connected!');
		}

		// get relevant data
		const phrase = interaction.options.getString('phrase');
		const channelId = interaction.options.getChannel('channel').id;
		const roleId = interaction.options.getRole('role').id;
		const guildId = interaction.guildId;
		const hashedPhrase = await argon2.hash(phrase, {type: argon2.argon2id});
		const passphrase = getPassphraseObject();
		
		try {
			// Checking if guild/channel combo already exists
			existingHash = await passphrase.findOne({
				where : {
					guild_id : guildId,
					channel_id : channelId
				}
			});

			// update if exists
			if (existingHash) {
				debugLog('Existing value found, updating');
				await passphrase.update(
					{
						phrase : hashedPhrase,
						role : roleId
					},
					{
						where : {
							guild_id : guildId,
							channel_id : channelId
						},
					}
				);
			}

			// insert if doesn't exist
			else {
				debugLog('Didn\'t find a value, inserting');
				await passphrase.upsert(
					{
						guild_id : guildId,
						channel_id : channelId,
						phrase : hashedPhrase,
						role_id : roleId
					},
				);
			}
		} catch (err) {
			logCommand(interaction, true, err.message);
			return await interaction.followUp({ content: `Something broke: ${err.message}` });
		}

		return await interaction.followUp({ content: `Successfully added passphrase!` });
	},
}