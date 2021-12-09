let TextToSpeech = require('../models/speech')

async function getTTS(hash) {
    return TextToSpeech.findOne({ hash: hash }, { _id: 0, __v: 0 });
}

async function addTTS(speechObject) {
    try {
        let tts = new TextToSpeech(speechObject)
        let resp = await tts.save()
        return resp
    } catch (err) {
        console.log(err);
        return undefined
    }

}

module.exports = ({ getTTS, addTTS })