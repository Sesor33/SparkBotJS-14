const { EmbedBuilder } = require('discord.js');

function getEmbed(data, embedType) {
    switch (embedType) {
        case 'video':
            return createVideoEmbed(data);
        case 'ability-scores':
            return createDndAbilityScoresEmbed(data);
        case 'classes':
            return createClassesEmbed(data);
        case 'equipment':
            //return createFallbackEmbed(data);
            return createEquipmentEmbed(data);
        default:
            return createFallbackEmbed(data);
        
    }
}


function formatDnDData(unformattedData, embedType) {
    let formattedData = {}
    switch (embedType) {
        case 'ability-scores':
            formattedData = {
                "title" : unformattedData["full_name"],
                "description" : unformattedData["desc"],
                "skills" : unformattedData["skills"]
            }
            break;
        case 'classes':
            formattedData = {
                "title" : unformattedData["name"],
                "hit_die" : unformattedData["hit_die"],
                "proficiencies" : unformattedData["proficiencies"],
                "saving_throws" : unformattedData["saving_throws"],
                "subclasses" : unformattedData["subclasses"]
            }
            break;
        case 'equipment':
            formattedData = {
                "title" : unformattedData["name"],
                "equipment_category" : unformattedData["equipment_category"]["name"],
                "cost": unformattedData["cost"]["quantity"] + ' ' + unformattedData["cost"]["unit"],
                "description" : unformattedData["desc"],
                "weight" : unformattedData["weight"] || null
            }
            break;
        default:
            formattedData = {
                "title" : unformattedData["name"],
                "description" : unformattedData["desc"]
            } 
    }
    return formattedData
}


function formatDescription(descriptionObject) {
   return Array.isArray(descriptionObject) ? descriptionObject.join('\n') : descriptionObject;
}


function createVideoEmbed(data) {
    const embed = new EmbedBuilder()
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


function createDndAbilityScoresEmbed(data) {
    let skills = [];
    if (data["skills"]) {
        for (let skill of data["skills"]) {
          skills.push(skill.name);
        }
    }

    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(data["title"])
        .setDescription(data["description"].join('\n')) // join to handle arrays better
        .setTimestamp()
        .addFields(
            { name: 'Skills', value: skills.join(', '), inline: false }
        );

    return embed; 
}

function createClassesEmbed(data) {
    // handle creating lists to use for formatting strings
    let proficiencies = [];
    let savingThrows = [];
    let subclasses = [];
    for (let proficiency of data["proficiencies"]) {
        proficiencies.push(proficiency.name);
    }
    for (let savingThrow of data["saving_throws"]) {
        savingThrows.push(savingThrow.name);
    }
    for (let subclass of data["subclasses"]) {
        subclasses.push(subclass.name);
    }

    const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle(data["title"])
        .setTimestamp()
        .addFields(
            { name: 'Proficiencies', value: proficiencies.join(', ') },
            { name: 'Hit die', value: data["hit_die"].toString(), inline: true },
            { name: 'Saving Throws', value: savingThrows.join(', '), inline: true },
            { name: 'Subclasses', value: subclasses.join(', '), inline: true }
        );

    return embed;
}

function createEquipmentEmbed(data) {
    let description = formatDescription(data["description"]);
    description = description ? description : '[No Description]';
    let weight = data["weight"] ? data["weight"].toString() : 'N/A';
    let cost = data["cost"] ? data["cost"] : 'N/A';

    const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle(data["title"])
        .setDescription(description)
        .addFields(
            { name: 'Category', value: data["equipment_category"], inline: true },
            { name: 'Cost', value: cost, inline: true },
            { name: 'Weight', value: weight, inline: true }
        )
        .setTimestamp();
    
    return embed;
}


function createFallbackEmbed(data) {
    // check if its an array or string
    let description = formatDescription(data["description"])
    const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setTitle(data["title"])
        .setDescription(description);

    return embed;
}

module.exports = { getEmbed, formatDnDData };