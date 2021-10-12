const fetch = require('node-fetch');
const {stringify} = require('uuid');
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
        entities.push({name: e.entity, value: e.value})
    }
    response = {
        "intent": data.intent.name,
        "entities": entities,
        "text": data.text
    }
    return response;
}

async function getResponse(text, pageId, sectionId) {
    let data
    let response
    try {
        let body = {"text": text, "pageId": pageId, "sectionId": sectionId};
        console.log('body =>', body)
        const resp = await fetch('http://api.gofindmenu.com:5010/response', {
            method: 'post',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await resp.json()
        console.log('reponse data  =>', data)
    } catch (err) {
        console.log(err);
    }
    return data

}

module.exports = ({getIntent, getResponse})
