const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getPassphraseObject, getConnectionStatus, getRateLimiter } = require('../../helpers/database');
const { formatList, debugLog } = require('../../helpers/util');
const argon2 = require('argon2');


module.exports = {
    data: new SlashCommandBuilder()
		.setName('listpassphrasechannels')
		.setDescription('Lists all channels in the current guild that have passphrases enabled')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
    async execute(interaction, client) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        // ensure DB is connected before proceeding
		if (!getConnectionStatus()) {
			return await interaction.followUp('Database is not connected!');
		}

        const guildId = interaction.guildId
        const passphrase = getPassphraseObject()
        var channelNames = []


        try {
            // get channels based on guild ID
            const result = await passphrase.findAll({
                attributes : ['channel_id'],
                where : {
                    guild_id : guildId
                }
            });
            // extract each dataValue result from result
            const records = result.map(function(res) {
                return res.dataValues
            })

            for (let entry of records) {
                const channel = await client.channels.fetch(entry.channel_id)
                channelNames.push(channel.name)
            }
        }  catch (err) {
            return await interaction.followUp({ content: `Error when contacting database ${err}` });
        }   

        
        return await interaction.followUp({ content: `Channels: ${formatList(channelNames)}` })
    }
}