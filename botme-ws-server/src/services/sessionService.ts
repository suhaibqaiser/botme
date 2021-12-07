const config = require('config')
const fetch = require('node-fetch');

export async function getSession(clientToken: string) {

    try {
        const res = await fetch(config.get('clientsAPI') + `/session/sessionbytoken?clientToken=${clientToken}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.get('bearerToken')}`
            }
        });

        let data: any = await res.json()
        return data.payload

    } catch (err) {
        console.log(err);
    }
}