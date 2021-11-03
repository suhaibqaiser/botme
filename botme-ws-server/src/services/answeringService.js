const commandService = require('./commandService')

async function generateAnswer(textToSpeech, pageId, sectionId) {
    var Response = await commandService.getResponse(textToSpeech, pageId, sectionId)
    if (Response) {
        let answer = {
            text: Response.Response,
            ctaId: Response.ctaCommandId,
            entityId: Response.entityId,
            entityName: Response.entityName,
            pageId: Response.pageId,
            sectionId: Response.sectionId,
            sentimentScore: Response.sentimentScore,
            intentName: Response.intentName
        };
        return answer
    } else {
        return undefined
    }
}

module.exports = ({generateAnswer})
