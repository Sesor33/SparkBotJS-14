const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Replies with server information'),
	async execute(interaction) {
		const msgEmbed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(interaction.guild.name)
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: 'Members', value: `${interaction.guild.memberCount}`, inline: true },
				{ name: 'Date created', value: `${interaction.guild.createdAt.toLocaleString()}`, inline: true },
				{ name: 'Channels', value: `${interaction.guild.channels.channelCountWithoutThreads}`, inline: false },
			)
			.setTimestamp()
			.setFooter({ text: `Queried by ${interaction.member.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}` });
		await interaction.reply({ embeds: [msgEmbed], ephemeral: true });
	},
};