const { SlashCommandBuilder } = require('discord.js');
const { fetchSRDData } = require('../../helpers/util'); 
const { DND_SEARCH_CATEGORY_OPTIONS, getAutocompleteOptions } = require('../../helpers/constants');
const { getEmbed, formatDnDData } = require('../../helpers/embedGenerator');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Searches for info on an item, spell, class, etc.')
		.addStringOption(option => option.setName('category')
			.setDescription('Category to search for')
			.setRequired(true)
			.setAutocomplete(true))
		.addStringOption(option => option.setName('name')
			.setDescription('Name to search for, case insensitive')
			.setRequired(true)
			.setAutocomplete(true)
		),

	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name == 'category') {
			choices = structuredClone(DND_SEARCH_CATEGORY_OPTIONS);
		}

		if (focusedOption.name == 'name') {
			console.log(`Trying to get options: ${interaction.options.getString('category')}`);
			choices =  await getAutocompleteOptions(interaction.options.getString('category'));
		}

		const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},


	async execute(interaction) {
		const category = interaction.options.getString('category');
		const name = interaction.options.getString('name');

		await interaction.deferReply();
		await interaction.followUp(`Searching for: **${category} - ${name}**`);
		
		try {
			const result = await fetchSRDData(category, name);
			const embedType = category.toLowerCase().replace(' ', '-');
			const formattedData = formatDnDData(result, embedType);
			const embed = getEmbed(formattedData, embedType);
			
			return await interaction.followUp({ embeds: [embed] });
		}
		catch (e) {
			return await interaction.followUp(`Something broke: ${e.message}`);
		}
	},
};
