const fetch = require('node-fetch');
const config = require('../config');

async function fetchToken(clientId, clientSecret) {
    let data
    try {
        let body = {
            "clientID": clientId,
            "clientSecret": clientSecret
        };
        const response = await fetch(config.apiServer + 'client/auth', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.bearerToken
            }
        });
        data = await response.json();
        console.log("Got result")
        console.log(data);
        if(data && data.status == "success" && data.payload && data.payload.clientToken) {
            return data.payload.clientToken;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = ({fetchToken})