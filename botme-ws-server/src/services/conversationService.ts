const fetch = require('node-fetch');
const config = require('config')

export async function addConversationLog(sessionId: string, query: any, response: any) {
    try {
        let conversationId = await getConversatonId(sessionId)

        if (!conversationId) return undefined

        let body = {
            "conversationId": conversationId,
            "query": query,
            "response": response.text
        };
        const res = await fetch(config.get('clientsAPI') + "/conversation/addConversationLog", {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.get('bearerToken')}`
            }
        });
        let data = await res.json()
        if (data.status === "success") {
            return data.payload
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err);
    }
}

async function getConversatonId(sessionId: string) {
    try {
        const res = await fetch(config.get('clientsAPI') + `/conversation/getConversationId?sessionId=${sessionId}`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${config.get('bearerToken')}`
            }
        });
        let data = await res.json()
        if (data.status === "success") {
            return data.payload
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err);
    }
}
