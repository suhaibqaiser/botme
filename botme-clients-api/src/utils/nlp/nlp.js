const { dockStart, ConsoleConnector } = require('@nlpjs/basic');
const Entity = require("../../models/entity");
const Corpus = require("../../models/corpus");
const fs = require('fs')
const nlpModelPath = './model.nlp'
let nlp = "";

// Initialize NLP
(async () => {
    await init()
})();

async function init (){
    const dock = await dockStart({ use: ['Basic'] });
    nlp = dock.get('nlp');

    nlp.trainByDomain = false;
    nlp.forceNER = true;
    nlp.threshold = '0.5'
    nlp.autoLoad = false
    nlp.autoSave = false
    await train()
}


async function getCorpus() {
    let corpusFromDB
    try {
        corpusFromDB = await Corpus.findOne({ active: true }, { _id: 0, __v: 0 })
        //corpusFromDB = await Corpus.findOne({}, { _id: 0, __v: 0 })
        console.log(corpusFromDB)
    } catch (err) {
        console.log(err)
    }

    //for (let l = 0; l < corpusFromDB.length; l++) {
        for (let i = 0; i < corpusFromDB.data.length; i++) {
            delete corpusFromDB.data[i].id

            let utterances = []
            let answers = []

            for (const u of corpusFromDB.data[i].utterances) {
                utterances.push(u.phrase)
            }
            corpusFromDB.data[i].utterances = utterances

            for (const u of corpusFromDB.data[i].answers) {
                answers.push({ answer: u.answer, opts: u.opts })
            }
            corpusFromDB.data[i].answers = answers
        }


        corpusFromDB.comment = undefined
        corpusFromDB.active = undefined
        corpusFromDB.corpusId = undefined
    //}
    console.log(corpusFromDB)
    return corpusFromDB
}

async function getEntities() {
    let entitiesFromDB
    try {
        entitiesFromDB = await Entity.find({ "name": { $ne: "gate" } }) //"name":"person"
    } catch (err) {
        console.log(err)
    }

    let entities = {}
    for (let i in entitiesFromDB) {
        let options = {}
        options = entitiesFromDB[i].options
        entities[entitiesFromDB[i].name] = { options }
    }
    return entities
}

async function train() {
    console.time('train')
    try {
        fs.unlinkSync(nlpModelPath);
    } catch (e) {
        console.log(e);
    }
    await nlp.addEntities(await getEntities());
    await nlp.addCorpus(await getCorpus());
    await nlp.train();
    console.timeEnd('train')
}

async function process(text) {
    try {
        let reply = await nlp.process(text)
        return reply
    } catch (err) {
        console.error(err)
    }
}

module.exports = { process, train, init }