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
		case 'monsters':
			return createMonstersEmbed(data, embed);
		case 'proficiencies':
			return createProficienciesEmbed(data, embed);
		case 'races':
			return createRacesEmbed(data, embed);
		case 'skills':
			return createSkillsEmbed(data, embed);
		case 'spells':
			return createSpellsEmbed(data, embed);
		case 'subclasses':
			return createSubclassesEmbed(data, embed);
		case 'traits':
			return createTraitsEmbed(data, embed);
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
		case 'monsters':
			formattedData = {
				"title" : unformattedData.name,
				"type" : unformattedData.type,
				"size" : unformattedData.size,
				"alignment" : unformattedData.alignment,
				"armor_class" : unformattedData.armor_class[0],
				"hit_points" : unformattedData.hit_points,
				"hit_dice" : unformattedData.hit_dice,
				"hit_points_roll" : unformattedData.hit_points_roll,
				"speed" : unformattedData.speed,
				"strength" : unformattedData.strength,
				"dexterity" : unformattedData.dexterity,
				"constitution" : unformattedData.constitution,
				"intelligence" : unformattedData.intelligence,
				"wisdom" : unformattedData.wisdom,
				"charisma" : unformattedData.charisma,
				"proficiencies" : unformattedData.proficiencies,
				"damage_vulnerabilities" : unformattedData.damage_vulnerabilities,
				"damage_resistances" : unformattedData.damage_resistances,
				"damage_immunities" : unformattedData.damage_immunities,
				"condition_immunities" : unformattedData.condition_immunities,
				"senses" : unformattedData.senses,
				"languages" : unformattedData.languages,
				"challenge_rating" : unformattedData.challenge_rating,
				"proficiency_bonus" : unformattedData.proficiency_bonus,
				"xp" : unformattedData.xp,
				"special_abilities" : unformattedData.special_abilities,
				"actions" : unformattedData.actions,
				"legendary_actions" : unformattedData.legendary_actions,
				"image_url" : unformattedData.image
			}
			break;
		case 'proficiencies':
			formattedData = {
				"title" : unformattedData.name,
				"classes" : unformattedData.classes,
				"races" : unformattedData.races
			}
			break;
		case 'races':
			formattedData = {
				"title" : unformattedData.name,
				"speed" : unformattedData.speed,
				"ability_bonuses" : unformattedData.ability_bonuses,
				"alignment" : unformattedData.alignment,
				"age" : unformattedData.age,
				"size" : unformattedData.size,
				"size_description" : unformattedData.size_description,
				"languages" : unformattedData.languages,
				"language_desc" : unformattedData.language_desc,
				"traits" : unformattedData.traits
			}
			break;
		case 'skills':
			formattedData = {
				"title" : unformattedData.name,
				"description" : unformattedData.desc, 
				"ability_score_name" : unformattedData.ability_score.name
			}
			break;
		case 'spells':
			formattedData = {
				"title" : unformattedData.name,
				"description" : unformattedData.desc,
				"higher_level" : unformattedData.higher_level,
				"range" : unformattedData.range,
				"components" : unformattedData.components,
				"material" : unformattedData.material || null,
				"ritual" : unformattedData.ritual,
				"duration" : unformattedData.duration,
				"concentration" : unformattedData.concentration,
				"casting_time" : unformattedData.casting_time,
				"level" : unformattedData.level,
				"damage" : unformattedData.damage || null,
				"dc" : unformattedData.dc || null,
				"area_of_effect" : unformattedData.area_of_effect || null,
				"school" : unformattedData.school,
				"classes" : unformattedData.classes,
				"subclasses" : unformattedData.subclasses
			}
			break;
		case 'subclasses':
			formattedData = {
				"title" : unformattedData.name,
				"description" : unformattedData.desc,
				"subclass_flavor" : unformattedData.subclass_flavor,
				"class" : unformattedData.class.name,
				"spells" : unformattedData.spells
			}
			break;
		case 'traits':
			formattedData = {
				"title" : unformattedData.name,
				"description" : unformattedData.desc,
				"races" : unformattedData.races
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
function formatDescription(descriptionObject, fallbackString = '[No Description]') {
   let result = Array.isArray(descriptionObject) ? descriptionObject.join('\n') : descriptionObject;
   return result ? result : fallbackString;
}


function formatList(listObject, fallbackString = 'N/A') {
	let result = Array.isArray(listObject) ? listObject.join(', ') : listObject;
	return result ? result : fallbackString;
}

// in case you need to get a nested value while stringifying
function getNestedValue(jsonObject, multiKey) {
	return multiKey.split('.').reduce((acc, key) => acc && acc[key], jsonObject);
}


function getStringifiedListFromJson(jsonObject, key, fallbackString = 'N/A', includeKey = false) {
	let resultList = [];
	for (let item of jsonObject) {
		const val = getNestedValue(item, key);
		if (val !== undefined) {
			resultList.push(val);
		}
	} 

	return formatList(resultList, fallbackString)
}


function formatObjectToStringWithKeys(jsonObject, joinChar = ', ') {
	if (typeof jsonObject !== 'object' || jsonObject === null) {
		return '';
	}

	// map over the entries of the object, formatting each key-value pair
	const formattedEntries = Object.entries(jsonObject).map(([key, value]) => {
		const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
		return `${capitalizedKey}: ${value}`;
	});

	return formattedEntries.join(joinChar);
}


// i didn't want to have to do this but i didn't feel like putting this inline
function formatAbilityBonuses(abilityBonuses) {
	let formattedBonuses = [];

	for (let abilityBonus of abilityBonuses) {
		const abilityName = getNestedValue(abilityBonus, 'ability_score.name');
		const bonusValue = abilityBonus.bonus;
		
		formattedBonuses.push(`${abilityName} +${bonusValue}`);
	}

	return formatList(formattedBonuses);
}


function formatSubclassSpells(subclassSpells) {
	if (!subclassSpells) {
		return '';
	}
	let formattedSpells = [];

	for (let spell of subclassSpells) {
		const prereqClass = spell.prerequisites[0].name
		const spellName = getNestedValue(spell, 'spell.name');
		console.log(spell);

		formattedSpells.push(`**Spell:** ${spellName}, **Prerequisite:** ${prereqClass}`);
	}

	return formatDescription(formattedSpells);
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
	let weight = data.weight
	let cost = data.cost ? data.cost : 'N/A';

	embed.setColor(0x0000FF)
		 .setDescription(description)
		 .addFields(
			{ name: 'Category', value: data.equipment_category, inline: true },
			{ name: 'Cost', value: cost, inline: true }
		);
	if (weight) {
		embed.addFields({ name: 'Weight', value: weight.toString(), inline: true });
	}

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
	let level = data.level;

	embed.setColor(0xFFFF00)
		 .setDescription(description)
		 .addFields(
			{ name: 'Class', value: className, inline: true }
		);
	if (level) {
		embed.addFields({ name: 'Level', value: level.toString(), inline: true });
	}

	return embed;
}


function createLanguagesEmbed(data, embed) {
	let speakers = formatDescription(data.speakers);
	let script = data.script;

	embed.setColor(0xFF00FF)
		 .addFields(
			{ name: 'Typical Speakers', value: speakers, inline: false },
			{ name: 'Type', value: data.type, inline: true },
		);
	if (script) {
		embed.addFields({ name: 'Script', value: script, inline: true });
	}

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


function createMonstersEmbed(data, embed) {
	let proficiencies = getStringifiedListFromJson(data.proficiencies, "proficiency.name", '[ No Proficiencies ]');
	let damage_vulnerabilities = formatList(data.damage_vulnerabilities, '[ No Vulnerabilities ]');
	let damage_resistances = formatList(data.damage_resistances, '[ No Resistances ]');
	let damage_immunities = formatList(data.damage_immunities, '[ No Damage Immunities ]');
	let condition_immunities = formatList(data.condition_immunities, '[ No Condition Immunities ]');
	let speed = formatObjectToStringWithKeys(data.speed);
	let senses = formatObjectToStringWithKeys(data.senses);
	let special_abilities = getStringifiedListFromJson(data.special_abilities, "name", '[ No Special Abilities ]');
	let actions = getStringifiedListFromJson(data.actions, "name", '[ No Actions ]');
	let legendary_actions = getStringifiedListFromJson(data.legendary_actions, "name", '[ No Legendary Action ]');
	let image_url = data.image_url ? 'https://www.dnd5eapi.co' + data.image_url : '';
	let statsObject = {
		"strength" : data.strength,
		"dexterity" : data.dexterity,
		"constitution" : data.constitution,
		"intelligence" : data.intelligence,
		"wisdom" : data.wisdom,
		"charisma" : data.charisma
	}
	let stats = formatObjectToStringWithKeys(statsObject, '\n');

	embed.setColor(0xFF0000)
		 .setThumbnail(image_url)
		 .addFields(
			{ name: 'HP', value: data.hit_points.toString() },
			{ name: 'Armor Class', value: data.armor_class.value.toString() },
			{ name: 'Size', value: data.size },
			{ name: 'Alignmnent', value: data.alignment },
			{ name: 'Challenge Rating', value: data.challenge_rating.toString() },
			{ name: 'Hit Dice', value: data.hit_dice },
			{ name: 'HP Roll', value: data.hit_points_roll },
			{ name: 'Size', value: data.size },
			{ name: 'Speed', value: speed },
			{ name: 'Stats', value: stats },
			{ name: 'XP', value: data.xp.toString() },
			{ name: 'Proficiencies', value: proficiencies },
			{ name: 'Proficiency Bonus ', value: data.proficiency_bonus.toString() },
			{ name: 'Damage Vulnerabilities', value: damage_vulnerabilities },
			{ name: 'Damage Resistances', value: damage_resistances },
			{ name: 'Damage Immunities', value: damage_immunities },
			{ name: 'Condition Immunities', value: condition_immunities },
			{ name: 'Senses', value: senses },
			{ name: 'Languages', value: data.languages },
			{ name: 'Special Abilities', value: special_abilities },
			{ name: 'Actions', value: actions },
			{ name: 'Legendary Actions', value: legendary_actions }
		);
	
	return embed;
}


function createProficienciesEmbed(data, embed) {
	let classes = getStringifiedListFromJson(data.classes, "name",'[ N/A ]');
	let races = getStringifiedListFromJson(data.races, "name", '[ N/A ]');

	embed.setColor(0xC4F530)
		 .addFields(
			{ name: 'Classes', value: classes, inline: false },
			{ name: 'Races', value: races, inline: false }
		);
	
		return embed;
}


function createRacesEmbed(data, embed) {
	let speed = data.speed.toString();
	let ability_bonuses = formatAbilityBonuses(data.ability_bonuses);
	let languages = getStringifiedListFromJson(data.languages, "name", '[ N/A ]');
	let traits = getStringifiedListFromJson(data.traits, "name", '[ N/A ]');

	embed.setColor(0x36BF5A)
		 .addFields(
			{ name: 'Speed', value: speed, inline: true },
			{ name: 'Ability Bonuses', value: ability_bonuses, inline: true },
			{ name: 'Alignment', value: data.alignment, inline: false },
			{ name: 'Age', value: data.age, inline: false },
			{ name: 'Size', value: data.size, inline: true },
			{ name: 'Size Desc', value: data.size_description, inline: true },
			{ name: 'Languages', value: languages, inline: false },
			{ name: 'Language Desc', value: data.language_desc, inline: true },
			{ name: 'Traits', value: traits, inline: false }
		);
	
	return embed;
}

function createSkillsEmbed(data, embed) {
	let description = formatDescription(data.description);
	let ability_score_name = data.ability_score_name;

	embed.setColor(0x36BF5A)
		 .setDescription(description)
		 .addFields(
		{ name: 'Ability Score', value: ability_score_name }
	);

	return embed;
}


function createSpellsEmbed(data, embed) {
	let description = formatDescription(data.description);
	let higher_level = formatDescription(data.higher_level, 'No higher level benefits');
	let range = data.range;
	let components = formatList(data.components);
	let ritual = data.ritual ? 'Yes' : 'No';
	let duration = data.duration;
	let concentration = data.concentration ? 'Yes': 'No';
	let casting_time = data.casting_time;
	let level = data.level.toString();
	let damage = data.damage;
	let dc = data.dc;
	let area_of_effect = data.area_of_effect;
	let school = data.school.name;
	let classes = getStringifiedListFromJson(data.classes, "name");
	let subclasses = getStringifiedListFromJson(data.subclasses, "name");
	

	embed.setColor(0x54CCFF)
		 .setDescription(description)
		 .addFields(
			{ name: 'Higher Levels', value: higher_level },
			{ name: 'Range', value: range },
			{ name: 'Components', value: components },
			{ name: 'Ritual', value: ritual },
			{ name: 'Duration', value: duration },
			{ name: 'Concentration', value: concentration },
			{ name: 'Casting Time', value: casting_time },
			{ name: 'Level', value: level },
			{ name: 'School', value: school },
			{ name: 'Classes', value: classes },
			{ name: 'Subclasses', value: subclasses }
		 );
	
	if (damage) {
		let damage_type = damage.damage_type.name;
		let damage_at_slot_level = formatObjectToStringWithKeys(damage.damage_at_slot_level);

		embed.addFields(
			{ name: 'Damage Type', value: damage_type },
			{ name: 'Damage at Level', value: damage_at_slot_level }
		);
	}

	return embed;
}


function createSubclassesEmbed(data, embed) {
	let description = formatDescription(data.description);
	let subclass_flavor = data.subclass_flavor;
	let class_name = data.class;
	let spells = data.spells? formatSubclassSpells(data.spells) : {};
	
	embed.setColor(0xFF5500)
		 .setDescription(description)
		 .addFields(
			{ name: 'Class', value: class_name },
			{ name: 'Flavor', value: subclass_flavor}
		 );
	if (spells) {
		embed.addFields(
			{ name: 'Spells', value: spells }
		);
	}
	
	return embed;
}


function createTraitsEmbed(data, embed) {
	let description = formatDescription(data.description);
	let races = getStringifiedListFromJson(data.races, "name");

	embed.setColor(0xFF5500)
		 .setDescription(description)
		 .addFields(
			{ name: 'Races', value: races }
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