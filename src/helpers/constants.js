const DND_SEARCH_CATEGORY_OPTIONS = [
	'Ability Scores',
	'Alignments',
	'Backgrounds',
	'Classes',
	'Conditions',
	'Damage Types',
	'Equipment',
	'Equipment Categories',
	'Feats',
	'Features',
	'Languages',
	'Magic Items',
	'Magic Schools',
	'Monsters',
	'Proficiencies',
	'Races',
	'Rule Sections',
	'Rules',
	'Skills',
	'Spells',
	'Subclasses',
	'Subraces',
	'Traits',
	'Weapon Properties',
];

const DND_SEARCH_ABILITY_SCORES_OPTIONS = [
	'CHA',
	'CON',
	'DEX',
	'INT',
	'STR',
	'WIS',
];

const DND_SEARCH_ALIGNMENT_OPTIONS = [
	'Chaotic Evil',
	'Chaotic Good',
	'Chaotic Neutral',
	'Lawful Evil',
	'Lawful Good',
	'Lawful Neutral',
	'Neutral',
	'Neutral Evil',
	'Neutral Good',
];

const DND_SEARCH_CLASS_OPTIONS = [
	'Barbarian',
	'Bard',
	'Cleric',
	'Druid',
	'Fighter',
	'Monk',
	'Paladin',
	'Ranger',
	'Rogue',
	'Sorcerer',
	'Warlock',
	'Wizard',
];

const DND_SEARCH_CONDITIONS_OPTIONS = [
	'Blinded',
	'Charmed',
	'Deafened',
	'Exhaustion',
	'Frightened',
	'Grappled',
	'Incapacitated',
	'Invisible',
	'Paralyzed',
	'Petrified',
	'Poisoned',
	'Prone',
	'Restrained',
	'Stunned',
	'Unconscious',
];

const DND_SEARCH_DAMAGE_TYPE_OPTIONS = [
	'Acid',
	'Bludgeoning',
	'Cold',
	'Fire',
	'Force',
	'Lightning',
	'Necrotic',
	'Piercing',
	'Poison',
	'Psychic',
	'Radiant',
	'Slashing',
	'Thunder',
];

const DND_SEARCH_EQUIPMENT_TYPES_OPTIONS = [
	'Adventuring Gear',
	'Ammunition',
	'Arcane Foci',
	'Armor',
	'Artisans Tools',
	'Druidic Foci',
	'Equipment Packs',
	'Gaming Sets',
	'Heavy Armor',
	'Holy Symbols',
	'Kits',
	'Land Vehicles',
	'Light Armor',
	'Martial Melee Weapons',
	'Martial Ranged Weapons',
	'Martial Weapons',
	'Medium Armor',
	'Melee Weapons',
	'Mounts and Other Animals',
	'Mounts and Vehicles',
	'Musical Instruments',
	'Other Tools',
	'Potion',
	'Ranged Weapons',
	'Ring',
	'Rod',
	'Scroll',
	'Shields',
	'Simple Melee Weapons',
	'Simple Ranged Weapons',
	'Simple Weapons',
	'Staff',
	'Standard Gear',
	'Tack, Harness, and Drawn Vehicles',
	'Tools',
	'Wand',
	'Waterborne Vehicles',
	'Weapon',
	'Wondrous Items',
];

const DND_SEARCH_LANGUAGES_OPTIONS = [
	'Abyssal',
	'Celestial',
	'Common',
	'Deep Speech',
	'Draconic',
	'Dwarvish',
	'Elvish',
	'Giant',
	'Gnomish',
	'Goblin',
	'Halfling',
	'Infernal',
	'Orc',
	'Primordial',
	'Sylvan',
	'Undercommon',
];

const DND_SEARCH_MAGIC_SCHOOLS_OPTIONS = [
	'Abjuration',
	'Conjuration',
	'Divination',
	'Enchantment',
	'Evocation',
	'Illusion',
	'Necromancy',
	'Transmutation',
];

const DND_SEARCH_RACES_OPTIONS = [
	'Dragonborn',
	'Dwarf',
	'Elf',
	'Gnome',
	'Half-Elf',
	'Half-Orc',
	'Halfling',
	'Human',
	'Tiefling',
];

const DND_SEARCH_RULES_OPTIONS = [
	'Adventuring',
	'Appendix',
	'Combat',
	'Equipment',
	'Spellcasting',
	'Using Ability Scores',
];

const DND_SEARCH_SKILLS_OPTIONS = [
	'Acrobatics',
	'Animal Handling',
	'Arcana',
	'Athletics',
	'Deception',
	'History',
	'Insight',
	'Intimidation',
	'Investigation',
	'Medicine',
	'Nature',
	'Perception',
	'Performance',
	'Persuasion',
	'Religion',
	'Sleight of Hand',
	'Stealth',
	'Survival',
];

const DND_SEARCH_SUBCLASSES_OPTIONS = [
	'Berserker',
	'Champion',
	'Devotion',
	'Draconic',
	'Evocation',
	'Fiend',
	'Hunter',
	'Land',
	'Life',
	'Lore',
	'Open Hand',
	'Thief',
];

const DND_SEARCH_WEAPON_PROPERTIES_OPTIONS = [
	'Ammunition',
	'Finesse',
	'Heavy',
	'Light',
	'Loading',
	'Monk',
	'Reach',
	'Special',
	'Thrown',
	'Two-Handed',
	'Versatile',
];


async function getAutocompleteOptions(category) {
	const lowerCaseCategory = category.toLowerCase();

	switch (lowerCaseCategory) {
	case 'ability scores':
		return DND_SEARCH_ABILITY_SCORES_OPTIONS;
	case 'alignments':
		return DND_SEARCH_ALIGNMENT_OPTIONS;
	case 'backgrounds':
		return [];
	case 'classes':
		return DND_SEARCH_CLASS_OPTIONS;
	case 'conditions':
		return DND_SEARCH_CONDITIONS_OPTIONS;
	case 'damage types':
		return DND_SEARCH_DAMAGE_TYPE_OPTIONS;
	case 'equipment':
		return [];
	case 'equipment categories':
		return DND_SEARCH_EQUIPMENT_TYPES_OPTIONS;
	case 'feats':
		return [];
	case 'features':
		return [];
	case 'languages':
		return DND_SEARCH_LANGUAGES_OPTIONS;
	case 'magic items':
		return [];
	case 'magic schools':
		return DND_SEARCH_MAGIC_SCHOOLS_OPTIONS;
	case 'monsters':
		return [];
	case 'proficiencies':
		return [];
	case 'races':
		return DND_SEARCH_RACES_OPTIONS;
	case 'rule sections':
		return [];
	case 'rules':
		return DND_SEARCH_RULES_OPTIONS;
	case 'skills':
		return DND_SEARCH_SKILLS_OPTIONS;
	case 'spells':
		return [];
	case 'subclasses':
		return DND_SEARCH_SUBCLASSES_OPTIONS;
	case 'subraces':
		return [];
	case 'traits':
		return [];
	case 'weapon properties':
		return DND_SEARCH_WEAPON_PROPERTIES_OPTIONS;
	default:
		console.error('Didn\'t find an applicable case for autocomplete');
		return [];
	}
}

module.exports = { DND_SEARCH_CATEGORY_OPTIONS, getAutocompleteOptions };