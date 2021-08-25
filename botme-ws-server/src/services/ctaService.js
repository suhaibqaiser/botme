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
async function getItem(Category) {
    let Ctas;
    try {
        Ctas = await Cta.find({productCategory:Category})
    } catch (err) {
        console.log(err);
    }
    return Ctas
}
module.exports = ({getCta,getItem});