const fetch = require('node-fetch');
const config = require('../config');

async function process(bearerToken, text) {
    var body = { "message": text };
    const response = await fetch(config.apiServer + 'nlp/communicate', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + bearerToken
        }
    });
    const data = await response.json();
    return data;
}
module.exports = ({ process })

