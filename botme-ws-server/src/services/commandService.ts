const fetch = require('node-fetch');
const config = require('config');

export async function getCommandResponse(text: string, pageId: string, sectionId: string, entities: string[], conversation: any) {

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
        console.log(data);

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
                conversation: {
                    conversationId: conversation.conversationId,
                    conversationLogId: conversation.conversationLogId,
                    conversationSequence: conversation.conversationSequence
                }
            };
            return answer
        } else {
            return {
                inputText: text,
                // FIXME: Change response
                text: 'There is an error in backend service',
                ctaId: '',
                entityId: '',
                entityName: '',
                pageId: '',
                sectionId: '',
                sentimentScore: '',
                intentName: 'error_commands_api',
                entities: '',
                conversation: {
                    conversationId: conversation.conversationId,
                    conversationLogId: conversation.conversationLogId,
                    conversationSequence: conversation.conversationSequence
                }
            };
        }
    } catch (err) {
        console.log(err);
        return {
            inputText: text,
            // FIXME: Change response
            text: 'There is an error in backend service',
            ctaId: '',
            entityId: '',
            entityName: '',
            pageId: '',
            sectionId: '',
            sentimentScore: '',
            intentName: 'error_commands_api',
            entities: '',
            conversation: {
                conversationId: conversation.conversationId,
                conversationLogId: conversation.conversationLogId,
                conversationSequence: conversation.conversationSequence
            }
        };
    }
}

