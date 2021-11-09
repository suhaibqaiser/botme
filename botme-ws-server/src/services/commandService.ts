const fetch = require('node-fetch');
import { addConversationLog } from './conversationService'
import config from '../config.json'

export async function getCommandResponse(sessionId:string ,text: string, pageId: string, sectionId: string) {

    try {
        let body = { "text": text, "pageId": pageId, "sectionId": sectionId };
        const res = await fetch(config.commandAPI + "/response", {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await res.json()
        if (data) {
            let answer = {
                text: data.Response,
                ctaId: data.ctaCommandId,
                entityId: data.entityId,
                entityName: data.entityName,
                pageId: data.pageId,
                sectionId: data.sectionId,
                sentimentScore: data.sentimentScore,
                intentName: data.intentName
            };
            addConversationLog(sessionId, text, answer)
            return answer
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err);
    }
}

