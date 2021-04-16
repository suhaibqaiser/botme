const { dockStart } = require('@nlpjs/basic');
const fs = require('fs');
var nlp = "";


//const airports = require('./airports.json');
//const airportKeys = Object.keys(airports);

// Initialize NLP
(async () => {
    const dock = await dockStart({ use: ['Basic'] });
    nlp = dock.get('nlp');

    nlp.trainByDomain = false;
    nlp.forceNER = true;
    nlp.threshold = '0.5'
    nlp.autoLoad = true
    nlp.autoSave = true
    nlp.modelFileName = __dirname + '/model.nlp';

    // for (let i = 0; i < airportKeys.length; i += 1) {
    // //     const airport = airports[airportKeys[i]];
    // //     nlp.addNerRuleOptionTexts('en', 'airport', airport.icao, airport.city);
    // // }

    var corpus = __dirname + '/corpus-commands.json';
    let commandEntities = fs.readFileSync(__dirname + '/entities-commands.json');
    var entities = JSON.parse(commandEntities);

    console.time('train')
    await train(corpus, entities)
    console.timeEnd('train')
})();

async function train(corpus, entities) {
    await nlp.addEntities(entities);
    await nlp.addCorpus(corpus);

    nlp.slotManager.addSlot('comm.gate', 'gate', true, { en: 'Please specify gate number?' })
    await nlp.train()
}

async function process(text) {
    try {
        const response = await nlp.process(text)
        return response
    } catch (err) {
        console.error(err)
    }

}
module.exports = { process, train }
