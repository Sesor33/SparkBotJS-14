const axios = require('axios');
const isLocalAPI = parseEnvBoolean(process.env.IS_LOCAL_API);
const debug = parseEnvBoolean(process.env.DEBUG);


function parseEnvBoolean(value) {
	return value && value.toLowerCase() !== 'false' && value !== '0';
}

function generateRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function fetchSRDData(category, name) {
	// You need a local version of the 5e SRD API to do local API, pictures not included
	const baseUrl = isLocalAPI ? 'http://localhost:3000/api/2014/' : 'https://www.dnd5eapi.co/api/2014/';
	console.log(baseUrl);
	const categoryFormatted = category.toLowerCase().replaceAll(' ', '-');
	const nameFormatted = name.toLowerCase().replaceAll(' ', '-');
	const requestUrl = `${baseUrl}${categoryFormatted}/${nameFormatted}`;

	try {
		const response = await axios.get(requestUrl);
		console.log(response.data);
		return response.data;
	}
	catch (e) {
		console.error(`Something broke when requesting from ${requestUrl}: `, e.message);
		throw e;
	}

}


// Format list to a single line joined by a commas
function formatList(listObject, fallbackString = 'N/A') {
	const result = Array.isArray(listObject) ? listObject.join(', ') : listObject;
	return result ? result : fallbackString;
}


// Function to easily handle logging to console if DEBUG environment var is on
function debugLog(obj) {
	if (debug) {
		console.log(obj);
	}
	return;
}


function getUserCount(client) {
	let totalUsers = 0;
	client.guilds.cache.forEach(guild => {
		totalUsers += guild.memberCount;
	});
	return totalUsers;
}


function getPing(client) {
	return client.ws.ping;
}

module.exports = { generateRandomNumber, fetchSRDData, formatList, debugLog, getUserCount, getPing };
