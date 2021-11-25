//google text to speech package
const speech = require('@google-cloud/speech')
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new speech.SpeechClient()
const ttsclient = new textToSpeech.TextToSpeechClient();
const fs = require('fs');
const util = require('util');

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'google-cloud-credentials.json'


// This method is used for Google TTS service
export async function getSpeechToText(payload: any) {
    const request = {
        audio: {
            content: payload
        },
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            audioChannelCount: 1,
            single_utterance: true
        },
        interimResults: false
    }

    const [response]: any = await client.recognize(request)
    let transcription = response.results.map((result: any) =>
        result.alternatives[0].transcript).join('\n');

    return transcription
}


export async function getTextToSpeech(text: string) {

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-UK', name: 'en-US-Wavenet-G', ssmlGender: 'FEMALE' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'OGG_OPUS' },
    };

    // Performs the text-to-speech request
    const [response] = await ttsclient.synthesizeSpeech(request);
    return response.audioContent
}
