const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Replies with info of User tagged')
		.addUserOption(option => option.setName('member')
			.setDescription('Member to get info on')
			.setRequired(true)),
	async execute(interaction) {
		const targetMember = interaction.options.getMember('member');
		const msgEmbed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(targetMember.displayName)
			.setThumbnail(targetMember.displayAvatarURL())
			.addFields(
				{ name: 'Username', value: `${targetMember.user.username}`, inline: true },
				{ name: 'ID', value: `${targetMember.id}`, inline: true },
			)
			.setTimestamp()
			.setFooter({ text: `Queried by ${interaction.member.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}` });
		await interaction.reply({ embeds: [msgEmbed], flags: MessageFlags.Ephemeral });
	},
};