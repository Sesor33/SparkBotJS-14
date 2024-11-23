const { SlashCommandBuilder } = require('discord.js');
const { fetchSRDData } = require('../../helpers/util'); 
const { DND_SEARCH_CATEGORY_OPTIONS } = require('../../helpers/constants');

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
        ),

    async autocomplete(interaction) {
        console.log('interaction options');
        const focusedOption = interaction.options.getFocused(true);
		let choices;
		choices = structuredClone(DND_SEARCH_CATEGORY_OPTIONS);
		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
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
            
            return await interaction.followUp(`Query result: ${result}`);
        }
        catch (e) {
            return await interaction.followUp(`Something broke: ${e.message}`);
        }
	},
};
