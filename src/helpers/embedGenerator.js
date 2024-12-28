const { EmbedBuilder } = require('discord.js');
const { safeGet } = require('./util');

function getEmbed(data, embedType) {
    switch (embedType) {
        case 'video':
            return createVideoEmbed(data);
        case 'ability-scores':
            return createDndAbilityScoresEmbed(data);
        case 'classes':
            return createClassesEmbed(data);
        case 'equipment':
            return createEquipmentEmbed(data);
        case 'equipment-categories':
            return createEquipmentCategoriesEmbed(data);
        case 'features':
            return createFeaturesEmbed(data);
        case 'languages':
            return createLanguagesEmbed(data);
        case 'magic-items':
            return createMagicItemsEmbed(data);
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
        case 'equipment-categories':
            formattedData = {
                "title" : unformattedData["name"],
                "equipment" : unformattedData["equipment"]
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
                "title" : unformattedData["name"],
                "description" : unformattedData["desc"]
            } 
    }
    return formattedData
}


// Description can be either a string or an array of strings, this handles that
function formatDescription(descriptionObject) {
   return Array.isArray(descriptionObject) ? descriptionObject.join('\n') : descriptionObject;
}


function formatList(listObject) {
    return Array.isArray(listObject) ? listObject.join(', ') : listObject;
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
    let skillList = []
    let description = formatDescription(data["description"]);
    if (data["skills"]) {
        for (let skill of data["skills"]) {
          skillList.push(skill.name);
        }
    }
    let skills = formatList(skillList);
    skills = skills ? skills : '[No Skills]';

    console.log('starting to build');
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(data["title"])
        .setDescription(description) // join to handle arrays better
        .setTimestamp()
        .addFields(
            { name: 'Skills', value: skills, inline: false }
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


function createEquipmentCategoriesEmbed(data) {
    let equipment = []
    for (let equip of data["equipment"]) {
        equipment.push(equip.name)
    }

    const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle(data["title"])
        .setDescription(equipment.join('\n'))
        .setTimestamp()
    return embed;
}


function createFeaturesEmbed(data) {
    let description = formatDescription(data.description);
    let className = data.class ? data.class : 'N/A' 
    let level = data.level ? data.level.toString() : 'N/A';
    description = description ? description : '[No Description]';

    const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle(data.title)
        .setDescription(description)
        .addFields(
            { name: 'Class', value: className, inline: true },
            { name: 'Level', value: level, inline: true }   
        )
        .setTimestamp()
    return embed;
}


function createLanguagesEmbed(data) {
    let speakers = formatDescription(data.speakers);
    let script = data.script;
    script = script ? script : 'N/A';

    
    const embed = new EmbedBuilder()
        .setColor(0xFF00FF)
        .setTitle(data.title)
        .addFields(
            { name: 'Typical Speakers', value: speakers, inline: false },
            { name: 'Type', value: data.type, inline: true },
            { name: 'Script', value: script, inline: true }   
        )
        .setTimestamp()
    return embed;

}


function createMagicItemsEmbed(data) {
    let description = formatDescription(data.description);
    description = description ? description : '[No Description]';


    const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle(data.title)
        .setDescription(description)
        .addFields(
            { name: 'Category', value: data.equipment_category, inline: true },
            { name: 'Rarity', value: data.rarity, inline: true }
        )
        .setTimestamp();
    return embed;
}


function createFallbackEmbed(data) {
    // check if its an array or string
    let description = formatDescription(data["description"]);
    const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setTitle(data["title"])
        .setDescription(description);
    return embed;
}

module.exports = { getEmbed, formatDnDData };