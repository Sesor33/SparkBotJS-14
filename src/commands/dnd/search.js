const { SlashCommandBuilder } = require('discord.js');
const { fetchSRDData } = require('../helpers/util'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Searches for info on an item, spell, class, etc.')
        .addStringOption(option => option.setName('category')
            .setDescription('Category to search for')
            .setRequired(true))
        .addStringOption(option => option.setName('name')
            .setDescription('Name to search for, case insensitive')
            .setRequired(true)
        ),

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
