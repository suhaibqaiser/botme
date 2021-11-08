import config from '../config.json'
const fetch = require('node-fetch');

export async function getSession(clientToken: string) {

    try {
        const res = await fetch(config.clientsAPI + `/session/sessionbytoken?clientToken=${clientToken}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.bearerToken}`
            }
        });
        
        let data: any = await res.json()
        return data.payload

    } catch (err) {
        console.log(err);
    }
}