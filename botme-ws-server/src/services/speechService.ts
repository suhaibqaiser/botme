//google text to speech package
const speech = require('@google-cloud/speech')
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new speech.SpeechClient()
const ttsclient = new textToSpeech.TextToSpeechClient();
const fs = require('fs');
const util = require('util');


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


export async function getTextToSpeech(text: string) {

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await ttsclient.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
    return response.audioContent
}
