//google text to speech package
const speech = require('@google-cloud/speech')
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new speech.SpeechClient()
const ttsclient = new textToSpeech.TextToSpeechClient();
const fetch = require('node-fetch');
const config = require('config')
const md5 = require('md5')


process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'google-cloud-credentials.json'

// This method is used for Google TTS service
export async function getSpeechToText(payload: any) {
    // fs.writeFile('input.wav', payload, (err: any) => {
    //     if (err)
    //         console.log(err);
    //     else {
    //         console.log("File written successfully\n");
    //     }
    // });
    const request = {
        audio: {
            content: payload
        },
        config: {
            // encoding: 'LINEAR16',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            audioChannelCount: 1,
            single_utterance: false
        },
        interimResults: false
    }

    const [response]: any = await client.recognize(request)
    let transcription = response.results.map((result: any) =>
        result.alternatives[0].transcript).join('\n');

    return transcription
}


export async function getTextToSpeech(text: string) {

    let hash = md5(text)
    let ttsResponse = await getTTS(hash)

    if (ttsResponse) {
        console.log("Used buffer from db");

        return Buffer.from(ttsResponse.buffer, 'base64')
    }

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
    await addTTS(hash, text, response.audioContent.toString('base64'))
    console.log("Used buffer from google cloud");
    return response.audioContent
}



export async function addTTS(hash: string, text: string, buffer: any) {


    try {
        let body = {
            tts: {
                "hash": hash,
                "text": text,
                "buffer": buffer
            }
        };

        const res = await fetch(config.get('clientsAPI') + "/speech/addtts", {
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

export async function getTTS(hash: string) {
    try {

        const res = await fetch(config.get('clientsAPI') + `/speech/gettts?hash=${hash}`, {
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
        console.log("error=>",err);
    }
}