var stopword = require('stopword');
var nlp = require('compromise');
nlp.extend(require('compromise-numbers'));

module.exports = {
    extractCommand: function (text) {
        text = stopword.removeStopwords(text.split(" "))
        text = text.slice(0, text.length - 1).join(', ') + " " + text.slice(-1);
        text = nlp(text).text('reduced')
        var n = nlp(text).nouns();
        var v = nlp(text).verbs();
        var t = nlp(text).topics();
        var num = nlp(text).numbers();
        command = 'Verb: ' + v.text() + ' Nouns: ' + n.text() + ' Numbers: ' + num.text()
        // console.log('Command:' + command)
        // console.log('Nouns: ' + n.text())
        // console.log('Verbs: ' + v.text())
        // console.log('Topics: ' + t.text())
        // console.log('Numbers: ' + num.text())
        return command;
    }
}