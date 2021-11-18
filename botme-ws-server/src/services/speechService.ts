//google text to speech package
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient()

const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    audioChannelCount: 1,
    single_utterance: true
}

// This method is used for Google TTS service
export async function getSpeechToText(payload: any) {
    const request = {
        audio: {
            content: payload
        },
        config: config,
        interimResults: true
    }

    const [response]: any = await client.recognize(request)
    let transcription = response.results.map((result: any) =>
        result.alternatives[0].transcript).join('\n');

    if (transcription) { return transcription }
}