const {dockStart} = require('@nlpjs/basic');
const Entity = require("../../models/entity");
const Corpus = require("../../models/corpus");
const fs = require('fs')
const nlpModelPath = './model.nlp'
let nlp = "";

// Initialize NLP
(async () => {
    const dock = await dockStart({use: ['Basic']});
    nlp = dock.get('nlp');

    nlp.trainByDomain = false;
    nlp.forceNER = true;
    nlp.threshold = '0.5'
    nlp.autoLoad = true
    nlp.autoSave = true
    await train()
})();

async function train() {
    async function getEntities() {
        let entitiesFromDB
        try {
            entitiesFromDB = await Entity.find({})
        } catch (err) {
            console.log(err)
        }

        let entities = {}
        for (let i in entitiesFromDB) {
            let options = {}
            options = entitiesFromDB[i].options
            let entityOptions = {options}
            entities[entitiesFromDB[i].name] = entityOptions
        }
        return entities
    }

    async function getCorpus() {
        let corpusFromDB
        try {
            corpusFromDB = await Corpus.findOne({}, {_id: 0, __v: 0})
        } catch (err) {
            console.log(err)
        }
        return corpusFromDB
    }

    console.time('train')
    try {
        fs.unlinkSync(nlpModelPath);
    } catch(e) {
        console.log(e);
    }

    await nlp.addEntities(await getEntities());
    await nlp.addCorpus(await getCorpus());
    await nlp.train();
    console.timeEnd('train')
}

async function process(text) {
    try {
        return await nlp.process(text)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {process, train}
