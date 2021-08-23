
// run this command first in you terminal
// export GOOGLE_APPLICATION_CREDENTIALS=innate-shell-323716-78b758d1671c.json

const express = require('express')
const cors = require("cors")
const bodyparser = require("body-parser")
const PORT = process.env.PORT || 3000
const app = express()
app.use(cors({ origin: "*" }))
app.use(bodyparser.json({ limit: '50mb' }))

const speech = require('@google-cloud/speech')
const fs = require('fs')
const multer = require('multer');
const client = new speech.SpeechClient()
// async function main() {
//     const client = new speech.SpeechClient()
//     const filename = './audio.wav'
//     const file = fs.readFileSync(filename)
//     const audioBytes = file.toString('base64')

//     const audio = {
//         content: audioBytes
//     }
//     const config = {
//         encoding: 'LINEAR16',
//         sampleRateHertz: 44100,
//         languageCode: 'en-US',
//         audioChannelCount: 2
//     }
//     const request = {
//         audio: audio,
//         config: config
//     }

//     console.log('please wait.......')
//     const [response] = await client.recognize(request)
//     console.log('response =>',)
//     const transcription = response.results.map(result =>
//         result.alternatives[0].transcript).join('\n')
//     console.log('Transcription :', transcription)
// }

// main().catch(console.error)

var upload = multer({dest:'uploads/'});


app.listen(PORT, () => {
    console.log("Port : " + PORT)
})

//default route
app.post('/getTextFromSpeech',upload.single('file'), async (req, res) => {
    console.log(req.file)
    const filename = './'+file.filename+'.wav'
    const fileing = fs.readFileSync(filename)
    const audioBytes = file.toString(fileing)
    const audio = {
        content: audioBytes
    }
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
        audioChannelCount: 2
    }
    const request = {
        audio: audio,
        config: config
    }

    console.log('please wait.......')
    client.recognize(request).then(
        ([response]) => {
            data = {
                status: 'true',
                data: response.results.map(result =>
                    result.alternatives[0].transcript).join('\n')
            }
            res.json(data)
        }, (err) => {
            res.json({
                'status':false,
                'message':'Failed to convert text'
            })
        }
    )


})