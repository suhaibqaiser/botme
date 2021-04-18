const { dockStart } = require('@nlpjs/basic');
const Entity = require("../../models/entity");
const fs = require('fs');
var nlp = "";

// Initialize NLP
(async () => {
    const dock = await dockStart({ use: ['Basic'] });
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
    //let rawdata = fs.readFileSync(__dirname + '/entities-commands.json');
    // entities = JSON.parse(rawdata)

    async function getEntities() {

        try {
            var entitiesFromDB = await Entity.find({})
        } catch (err) {
            console.log(err)
        }

        var entities = {}
        for (i in entitiesFromDB) {
            var options = {}
            options = entitiesFromDB[i].options
            var entityOptions = { options }
            entities[entitiesFromDB[i].name] = entityOptions
        }

        return await entities
    }
    //console.log(await getEntities())

    await nlp.addEntities(await getEntities());
    await nlp.addCorpus(__dirname + '/corpus-commands.json');
    await nlp.train()
}

async function process(text) {
    try {
        const response = await nlp.process(text);
        return response
    } catch (err) {
        console.error(err)
    }

}
module.exports = { process, train }
