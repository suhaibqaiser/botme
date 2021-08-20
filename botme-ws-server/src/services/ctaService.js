const Cta = require('../models/cta');

async function getCta(intentname) {
    let Ctas;
    try {
        Ctas = await Cta.find({intentName:intentname})
    } catch (err) {
        console.log(err);
    }
    return Ctas
}
module.exports = ({getCta});