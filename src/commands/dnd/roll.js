const { SlashCommandBuilder } = require('discord.js');
const { GenerateRandomNumber } = require('../helpers/util'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Sets the volume to a selected value')
        .addNumberOption(option => option.setName('numdice')
            .setDescription('Number of dice to roll')
            .setMinValue(1)
            .setMaxValue(1000)
            .setRequired(true))
        .addNumberOption(option => option.setName('dicevalue')
            .setDescription('Value of a single die')
            .setMinValue(1)
            .setMaxValue(1000)
            .setRequired(true)
        ),
	async execute(interaction) {
        const numDice = interaction.options.getNumber('numdice');
        const diceValue = interaction.options.getNumber('dicevalue');

        await interaction.deferReply();
        await interaction.followUp(`Rolling **${numDice}d${diceValue}**`);
		
        var total = 0;

        for (let i = 0; i < numDice; i++) {
            rollValue = GenerateRandomNumber(1, diceValue);
            total += rollValue;

            if (diceValue == 20 && rollValue == 20) {
                await interaction.followUp('**NAT 20!**');
            }
        }

		return await interaction.followUp(`Roll: **${total}**`);
	},
};
