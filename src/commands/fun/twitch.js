const { SlashCommandBuilder } = require('discord.js');
const { twitchUrl } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitch')
		.setDescription('Advertises the creator\'s Twitch channel'),
	async execute(interaction) {
		await interaction.reply({ content: `Nyeh heh heh! Check out my Twitch channel\n\n${twitchUrl}` });
	},
};