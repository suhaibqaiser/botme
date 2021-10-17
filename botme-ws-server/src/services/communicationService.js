// run this command first in you terminal
// export GOOGLE_APPLICATION_CREDENTIALS=innate-shell-323716-78b758d1671c.json


const fetch = require('node-fetch');
const config = require('../config');
//google text to speech package
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient()


// This method is used for Google TTS service
async function getSpeechToText(text) {
    // let data
    // try {
    //     let body = {"message": text};
    //     const response = await fetch(config.clientsAPI + 'nlp/communicate', {
    //         method: 'post',
    //         body: JSON.stringify(body),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + config.bearerToken
    //         }
    //     });
    //     data = await response.json();
    // } catch (err) {
    //     console.log(err);
    // }
    // return data;
    const audioBytes = text
    const audio = {
        content: audioBytes
    }
    const config = {
        encoding: 'LINEAR16',
        languageCode: 'en-US',
        audioChannelCount: 2
    }
    const request = {
        audio: audio,
        config: config
    }
    console.log('please wait.......')
    return await client.recognize(request).then(
        ([response]) => {
            return response.results.map(result =>
                result.alternatives[0].transcript).join('\n')
        }, (err) => {
            console.log(err)
            return err
        }
    )
}

module.exports = ({getSpeechToText})
