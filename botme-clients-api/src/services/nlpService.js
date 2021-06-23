const fetch = require('node-fetch')
const nlpApiUri = 'http://localhost:5005/webhooks/rest/webhook'

async function process(sessionId, text) {
    let res 
    body = {
        "sender": sessionId,
        "message": text
    }
    await fetch(nlpApiUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        timeout: 600,  
    })
    .then(res => res.json())
    .then(json => res = json)
    .catch(err => console.error(err));
    return res
}


module.exports = ({ process })