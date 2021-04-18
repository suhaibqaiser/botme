const {dockStart} = require('@nlpjs/basic');
const Entity = require("../../models/entity");
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

    console.time('train')
    await train()
    console.timeEnd('train')
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

    await nlp.addEntities(await getEntities());
    await nlp.addCorpus(__dirname + '/corpus-commands.json');
    await nlp.train()
}

async function process(text) {
    try {
        return await nlp.process(text)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {process, train}
