const fetch = require('node-fetch');
const config = require('../config');

async function process(text) {
    let data
    try {
        let body = {"message": text};
        const response = await fetch(config.apiServer + 'nlp/communicate', {
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