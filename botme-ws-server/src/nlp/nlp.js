const { dockStart } = require('@nlpjs/basic');
var nlp = "";

(async () => {
    const dock = await dockStart({ use: ['Basic'] });
    nlp = dock.get('nlp');
    await nlp.addCorpus('./build/nlp/corpus-en.json');
    await nlp.train();
})();

module.exports = {
    process: async function (text) {
        var response = await nlp.process(text);
        console.log(response)
        return response
    }
}