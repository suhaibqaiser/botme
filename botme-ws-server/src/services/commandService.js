const fetch = require('node-fetch');
const config = require('../config');

// Service to access RASA NLU API

async function getIntent(text) {
    let data
    let response
    let entities = []
    try {
        let body = {"text": text};
        const response = await fetch(config.rasaAPI + '/model/parse', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await response.json();
    } catch (err) {
        console.log(err);
    }
    for (let e of data.entities) {
        entities.push({ name: e.entity, value: e.value })
    }
    response = {
        "intent": data.intent.name,
        "entities": entities,
        "text" : data.text
    }
    return response;
}

module.exports = ({getIntent})