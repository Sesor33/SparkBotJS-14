const { EmbedBuilder } = require('discord.js');

function getEmbed(data, embedType) {
    const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setTimestamp();

    switch (embedType) {
        case 'video':
            return createVideoEmbed(data, embed);
        case 'ability-scores':
            return createDndAbilityScoresEmbed(data, embed);
        case 'classes':
            return createClassesEmbed(data, embed);
        case 'equipment':
            return createEquipmentEmbed(data, embed);
        case 'equipment-categories':
            return createEquipmentCategoriesEmbed(data, embed);
        case 'features':
            return createFeaturesEmbed(data, embed);
        case 'languages':
            return createLanguagesEmbed(data, embed);
        case 'magic-items':
            return createMagicItemsEmbed(data, embed);
        default:
            return createFallbackEmbed(data, embed);
    }
}


function formatDnDData(unformattedData, embedType) {
	let formattedData = {}
	switch (embedType) {
		case 'ability-scores':
			formattedData = {
				"title" : unformattedData.full_name,
				"description" : unformattedData.desc,
				"skills" : unformattedData.skills
			}
			break;
		case 'classes':
			formattedData = {
				"title" : unformattedData.name,
				"hit_die" : unformattedData.hit_die,
				"proficiencies" : unformattedData.proficiencies,
				"saving_throws" : unformattedData.saving_throws,
				"subclasses" : unformattedData.subclasses
			}
			break;
		case 'equipment':
			formattedData = {
				"title" : unformattedData.name,
				"equipment_category" : unformattedData.equipment_category.name,
				"cost": unformattedData.cost.quantity + ' ' + unformattedData.cost.unit,
				"description" : unformattedData.desc,
				"weight" : unformattedData.weight || null
			}
			break;
		case 'equipment-categories':
			formattedData = {
				"title" : unformattedData.name,
				"equipment" : unformattedData.equipment
			}
			break;
		case 'features':
			formattedData = {
				"title" : unformattedData.name,
				"description" : unformattedData.desc,
				"level" : unformattedData.level || null,
				"class" : unformattedData.class.name
			}
			break;
		case 'languages':
			formattedData = {
				"title" : unformattedData.name,
				"type" : unformattedData.type,
				"speakers" : unformattedData.typical_speakers,
				"script" : unformattedData.script || null
			}
			break;
		case 'magic-items':
			formattedData = {
				"title" : unformattedData.name,
				"equipment_category" : unformattedData.equipment_category.name,
				"description" : unformattedData.desc,
				"rarity" : unformattedData.rarity.name
			}
			break;
		default:
			formattedData = {
				"title" : unformattedData.name,
				"description" : unformattedData.desc
			} 
	}
	return formattedData
}


// Description can be either a string or an array of strings, this handles that
function formatDescription(descriptionObject) {
   let result = Array.isArray(descriptionObject) ? descriptionObject.join('\n') : descriptionObject;
   return result ? result : '[No Description]';
}


function formatList(listObject, fallbackString = 'N/A') {
	let result = Array.isArray(listObject) ? listObject.join(', ') : listObject;
	return result ? result : fallbackString;
}


function getStringifiedListFromJson(jsonObject, key, fallbackString = 'N/A') {
	let resultList = [];
	for (let item of jsonObject) {
		if (item.hasOwnProperty(key)) {
			console.log(item[key]);
			resultList.push(item[key]);
		}
	}

	return formatList(resultList, fallbackString)
}


function createVideoEmbed(data, embed) {
    embed.setColor(0xFFFFFF)
         .setURL(data.url)
         .setAuthor(data.author)
         .setDescription(data.description)
         .setThumbnail(data.thumbnail)
         .addFields(
            { name: 'Duration', value: data.duration, inline: true },
            { name: 'Views', value: data.views.toString(), inline: true },
        );
    return embed;
}

function createDndAbilityScoresEmbed(data, embed) {
    let skillList = [];
    let description = formatDescription(data.description);
    if (data.skills) {
        for (let skill of data.skills) {
            skillList.push(skill.name);
        }
    }
    let skills = formatList(skillList);
    skills = skills ? skills : '[No Skills]';

    embed.setColor(0x00FF00)
         .setDescription(description)
         .addFields(
            { name: 'Skills', value: skills, inline: false }
        );
    return embed;
}

function createClassesEmbed(data, embed) {
    let proficiencies = getStringifiedListFromJson(data.proficiencies, 'name');
    let savingThrows = getStringifiedListFromJson(data.saving_throws, 'name');
    let subclasses = getStringifiedListFromJson(data.subclasses, 'name');

    embed.setColor(0xFFFF00)
         .addFields(
            { name: 'Proficiencies', value: proficiencies },
            { name: 'Hit die', value: data.hit_die.toString(), inline: true },
            { name: 'Saving Throws', value: savingThrows, inline: true },
            { name: 'Subclasses', value: subclasses, inline: true }
        );
    return embed;
}

function createEquipmentEmbed(data, embed) {
    let description = formatDescription(data.description);
    let weight = data.weight ? data.weight.toString() : 'N/A';
    let cost = data.cost ? data.cost : 'N/A';

    embed.setColor(0x0000FF)
         .setDescription(description)
         .addFields(
            { name: 'Category', value: data.equipment_category, inline: true },
            { name: 'Cost', value: cost, inline: true },
            { name: 'Weight', value: weight, inline: true }
        );
    return embed;
}

function createEquipmentCategoriesEmbed(data, embed) {
    let equipment = getStringifiedListFromJson(data.equipment, 'name');

    embed.setColor(0x0000FF)
         .setDescription(equipment);
    return embed;
}

function createFeaturesEmbed(data, embed) {
    let description = formatDescription(data.description);
    let className = data.class ? data.class : 'N/A';
    let level = data.level ? data.level.toString() : 'N/A';

    embed.setColor(0xFFFF00)
         .setDescription(description)
         .addFields(
            { name: 'Class', value: className, inline: true },
            { name: 'Level', value: level, inline: true }
        );
    return embed;
}

function createLanguagesEmbed(data, embed) {
    let speakers = formatDescription(data.speakers);
    let script = data.script;
    script = script ? script : 'N/A';

    embed.setColor(0xFF00FF)
         .addFields(
            { name: 'Typical Speakers', value: speakers, inline: false },
            { name: 'Type', value: data.type, inline: true },
            { name: 'Script', value: script, inline: true }
        );
    return embed;
}

function createMagicItemsEmbed(data, embed) {
    let description = formatDescription(data.description);

    embed.setColor(0x0000FF)
         .setDescription(description)
         .addFields(
            { name: 'Category', value: data.equipment_category, inline: true },
            { name: 'Rarity', value: data.rarity, inline: true }
        );
    return embed;
}

function createFallbackEmbed(data, embed) {
    let description = formatDescription(data.description);

    embed.setColor(0x000000)
         .setDescription(description);
    return embed;
}

module.exports = { getEmbed, formatDnDData };