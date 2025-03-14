const axios = require('axios');
const isLocalAPI = process.env.IS_LOCAL_API;


function generateRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function fetchSRDData(category, name) {
	// You need a local version of the 5e SRD API to do local API, pictures not included
	const baseUrl = isLocalAPI ? 'http://localhost:3000/api/2014/' : 'https://www.dnd5eapi.co/api/';
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


module.exports = { generateRandomNumber, fetchSRDData };
