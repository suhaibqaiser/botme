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
async function rasaProcess(text) {
    let data
    try {
        let body = {"text": text};
        const response = await fetch(config.rasaApi + 'model/parse', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await response.json();
        // productName = data.entities[0].value
        // console.log(productName)
    } catch (err) {
        console.log(err);
    }
    return data;
}

module.exports = ({process,rasaProcess})
