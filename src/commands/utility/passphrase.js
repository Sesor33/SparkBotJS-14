const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getPassphraseObject, getConnectionStatus } = require('../../helpers/database');
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
		const passphrase = getPassphraseObject();
		
		try {
			// checking if guild/channel combo already exists
			existingHash = await passphrase.findOne({
				where : {
					guild_id : guildId,
					channel_id : channelId
				}
			});

			// if it does, check auth with argon2 
			if (existingHash) {
				if (await argon2.verify(existingHash.phrase, phrase)) {
					interaction.member.roles.add(existingHash.role_id, 'User properly authenticated');
					return await interaction.reply({ content: `Authenticated!`, flags: MessageFlags.Ephemeral });
				}
				else {
					return await interaction.reply({ content: `Incorrect passphrase`, flags: MessageFlags.Ephemeral });
				}
			}
			else {
				// no auth exists on channel
				return await interaction.reply({ content: `No auth is set on for this channel`, flags: MessageFlags.Ephemeral });
			}
		} catch (err) {
			return await interaction.reply(`Something broke: ${err.message}`);
		}
	},
}