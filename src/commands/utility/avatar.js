const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Replies with the avatar URL of chosen member')
		.addUserOption(option => option.setName('member')
			.setDescription('Member to get avatar of')
			.setRequired(true),
		)
		.addIntegerOption(option => option.setName('resolution')
			.setDescription('Image resolution')
			.setRequired(true)
			.addChoices(
				{ name: 'Small', value: 256 },
				{ name: 'Medium', value: 512 },
				{ name: 'Large', value: 1024 },

			))
		.addStringOption(option => option.setName('format')
			.setDescription('Image format')
			.setRequired(true)
			.addChoices(
				{ name: 'PNG', value: 'png' },
				{ name: 'JPG', value: 'jpg' },
				{ name: 'The bad one', value: 'webp' },
			)),
	async execute(interaction) {
		const targetMember = interaction.options.getMember('member');
		const optionResolution = interaction.options.getInteger('resolution');
		const optionExtension = interaction.options.getString('format');

		await interaction.reply({ content: `${targetMember.displayAvatarURL({ extension: optionExtension, size: optionResolution })}`, flags: MessageFlags.Ephemeral });
	},
};