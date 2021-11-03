const fetch = require('node-fetch');
const {stringify} = require('uuid');
const config = require('../config');

async function getResponse(text, pageId, sectionId) {
    let data
    // let response
    pageId ='pageId-order-online'
    sectionId ='sectionId-product-list'
    try {
        let body = {"text": text,"pageId": pageId,"sectionId": sectionId};
        const response = await fetch(config.commandapi + "/response" ,{
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = response.json()
    } catch (err) {
        console.log(err);
    }
    return data

}


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



module.exports = ({getIntent, getResponse})
