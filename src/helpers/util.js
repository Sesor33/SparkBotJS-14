const axios = require('axios');


function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function fetchSRDData(category, name) {
    const baseUrl = 'https://www.dnd5eapi.co/api/'
    const categoryFormatted = category.toLowerCase().replace(' ', '-');
    const nameFormatted = name.toLowerCase().replace(' ', '-');
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
