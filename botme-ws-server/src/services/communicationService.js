const fetch = require('node-fetch');
const config = require('../config');

// This method is used for Google TTS service
async function process(text) {
    let data
    try {
        let body = {"message": text};
        const response = await fetch(config.clientsAPI + 'nlp/communicate', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.bearerToken
            }
        });
        data = await response.json();
    } catch (err) {
        console.log(err);
    }
    return data;
}

module.exports = ({process})