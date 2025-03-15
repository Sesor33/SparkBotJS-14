const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPassphraseObject, getConnectionStatus } = require('../../helpers/database');
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
        await interaction.deferReply()
        if (!getConnectionStatus()) {
            return await interaction.followUp('Database is not connected!');
        }
        const phrase = interaction.options.getString('phrase');
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const hashedPhrase = await argon2.hash(phrase, {type: argon2.argon2id});
        const passphrase = getPassphraseObject();
        
        try {
            await passphrase.upsert({
                guild_id : interaction.guild.id,
                channel_id : channel.id,
                phrase : hashedPhrase,
                role_id : role.id
            });
        } catch (err) {
			return await interaction.followUp(`Something broke: ${err.message}`);
        }

        return await interaction.followUp('Successfully added passphrase!');
    },
}