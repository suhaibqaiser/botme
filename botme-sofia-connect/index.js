
// run this command first in you terminal
// export GOOGLE_APPLICATION_CREDENTIALS=innate-shell-323716-78b758d1671c.json

const express = require('express')
const cors = require("cors")
const path = require('path')
const bodyparser = require("body-parser")
const PORT = process.env.PORT || 3000
const app = express()
app.use(cors({ origin: "*" }))
app.use(bodyparser.json({ limit: '50mb' }))

const speech = require('@google-cloud/speech')
const fs = require('fs')
const multer = require('multer');
const client = new speech.SpeechClient()

//multer
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'index/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


//default route
app.post('/getTextFromSpeech', upload.single('file'), async (req, res) => {
     console.log(req.file)
    const filename = path.resolve('./index/uploads/' + req.file.filename)
    const file = fs.readFileSync(filename)
    const audioBytes = file.toString('base64')
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
                'status': false,
                'message': 'Failed to convert text'
            })
        }
    )


})

app.listen(PORT, () => {
    console.log("Port : " + PORT)
})