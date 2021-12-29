import {responseJson} from "../models";

const fetch = require('node-fetch');
const config = require('config');

export async function getCommandResponse(text: string, pageId: string, sectionId: string, entities: any, conversation: any) {

    // reponse from command api
    let answer: responseJson = {
        ctaId: null,
        inputText: {
            language: "",
            textValue: "",
            timestamp: Date()
        },
        outputText: {
            language: "english",
            textValue: "",
            timestamp: Date()
        },
        context: {
            pageId: "",
            sectionId: "",
            parentEntity: {
                entityId: null,
                entityValue: null
            },
            entities: [
                {
                    clickAttribute: null,
                    entityId: "",
                    entityValue: "",
                    keywords: null,
                    entitySelected: false
                }
            ]
        },
        action: [
            {
                actionType: null,
                actionId: null,
                actionValue: null
            }
        ],
        conversation: {
            conversationId: conversation.conversationId,
            conversationLogId: conversation.conversationLogId,
            conversationSequence: conversation.conversationSequence,
        }
    }


    try {
        let body = {
            inputText: {
                language: "english",
                textValue: text,
                timestamp: Date()
            },
            context: {
                pageId: pageId,
                sectionId: sectionId,
                parentEntity: {
                    entityId: "",
                    entityValue: ""
                },
                entities: entities
            }
        }

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
            return answer = {
                ctaId: data.ctaId,
                inputText: {
                    language: data.inputText.language,
                    textValue: data.inputText.textValue,
                    timestamp: data.inputText.timestamp
                },
                outputText: {
                    language: "english",
                    textValue: data.outputText.textValue,
                    timestamp: Date()
                },
                context: {
                    pageId: data.context.pageId,
                    sectionId: data.context.sectionId,
                    parentEntity: {
                        entityId: data.context.parentEntity.entityId,
                        entityValue: data.context.parentEntity.entityValue
                    },
                    entities: data.context.entities
                },
                action: [
                    {
                        actionType: null,
                        actionId: null,
                        actionValue: null
                    }
                ],
                conversation: {
                    conversationId: conversation.conversationId,
                    conversationLogId: conversation.conversationLogId,
                    conversationSequence: conversation.conversationSequence,
                }
            }
        } else {
            answer.inputText.textValue = text
            answer.outputText.textValue = 'There is an error in backend service'
            return answer
        }
    } catch (err) {
        console.log(err);
        answer.inputText.textValue = text
        answer.outputText.textValue = 'There is an error in backend service'
        return answer
    }
}

