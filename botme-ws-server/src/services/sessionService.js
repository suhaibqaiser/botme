const Session = require('../models/session');

async function getSession(clientToken) {
    let session;
    try {
        session = await Session.findOne({clientToken: clientToken})
    } catch (err) {
        console.log(err);
    }
    return session
}


module.exports = ({getSession});