const fetch = require('node-fetch');
const config = require('config')

export async function addConversation(sessionId: string) {
    try {
        let body = {
            "sessionId": sessionId
        };
        const res = await fetch(config.get('clientsAPI') + "/conversation/addConversation", {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.get('bearerToken')}`
            }
        });
        let data = await res.json()
        if (data.status === "success") {
            return data.payload.conversationId
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err);
    }
}

export async function addConversationLog(conversationId: string) {
    try {
        let body = {
            "conversationId": conversationId
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
            return data.payload.conversationLogId
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err);
    }
}


export async function updateConversationLog(conversationLogId: string, param: string, value: any) {
    try {

        let body = {
            "conversationLogId": conversationLogId,
            "param": param,
            "value": value
        };
        const res = await fetch(config.get('clientsAPI') + "/conversation/updateConversationLog", {
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

export async function endConversation(conversationId: string) {
    try {

        let body = {
            "conversationId": conversationId,
            "rating": 5
        };

        const res = await fetch(config.get('clientsAPI') + "/conversation/endConversation", {
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
