export interface SocketMessage {
    payload: object,
    type: string,
    timestamp: string
}

/**
 * Response from command api format
 */
export interface responseJson {
    ctaId: string | null,
    inputText: {
        language: string,
        textValue: string,
        timestamp: string
    },
    outputText: {
        language: string,
        textValue: string,
        timestamp: string
    },
    context: {
        pageId: string,
        sectionId: string,
        parentEntity: {
            entityId: string | null,
            entityValue: any | null
        },
        entities: [
            {
                "clickAttribute": string | null,
                "entityId": string,
                "entityValue": string,
                "keywords": string | null,
                "entitySelected": boolean
            }
        ]
    },
    action: [
        {
            actionType: string | null,
            actionId: string | null,
            actionValue: string | null
        }
    ],
    conversation: {
        conversationId: string,
        conversationLogId: string,
        conversationSequence: string,
    }
}
