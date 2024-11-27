const { EmbedBuilder } = require('discord.js');

function getEmbed(data, embedType) {
    switch (embedType) {
        case 'video':
            return createVideoEmbed(data);
    }
}


function createVideoEmbed(data) {
    embed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(data["title"])
        .setURL(data["url"])
        .setAuthor(data["author"])
        .setDescription(data["description"])
        .setThumbnail(data["thumbnail"])
        .setTimestamp()
        .addFields(
			{ name: 'Duration', value: data["duration"], inline: true },
			{ name: 'Views', value: data["views"].toString(), inline: true },
		);
    return embed;
}

module.exports = { getEmbed };