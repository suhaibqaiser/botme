const fetch = require('node-fetch');
import { addConversationLog } from './conversationService'
const config = require('config');

export async function getCommandResponse(sessionId: string, text: string, pageId: string, sectionId: string, entities: string[], uniqueConvId: number) {

    try {
        let body = { "text": text, "pageId": pageId, "sectionId": sectionId, "entities": entities };
        const res = await fetch(config.get('commandAPI') + "/response", {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await res.json()
        if (data) {
            let answer = {
                inputText: text,
                text: data.Response,
                ctaId: data.ctaCommandId,
                entityId: data.entityId,
                entityName: data.entityName,
                pageId: data.pageId,
                sectionId: data.sectionId,
                sentimentScore: data.sentimentScore,
                intentName: data.intentName,
                entities: data.entities,
                uniqueConversationId: uniqueConvId
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

