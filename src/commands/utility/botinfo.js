const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { version } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Replies with bot information'),
	async execute(interaction, client) {
		const msgEmbed = new EmbedBuilder()
			.setColor('#00d107')
			.setTitle(`${client.user.username}`)
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: 'Version', value: `${version}`, inline: true },
				{ name: 'Current Server', value: `${interaction.guild.name}`, inline: true },
				{ name: 'API Latency', value: `${client.ws.ping} ms`, inline: false },
			)
			.setTimestamp()
			.setFooter({ text: `Queried by ${interaction.member.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}` });
		await interaction.reply({ embeds: [msgEmbed], flags: MessageFlags.Ephemeral });
	},
};