const Session = require("../models/session")


async function createSession(session) {
    let newSession = new Session(session)
    return newSession.save()
}

async function getSessionDetails(sessionId) {
    return Session.findOne({sessionId: sessionId}, {
        "_id": 0,
        "__v": 0
    })
}

async function getSessionByToken(clientToken) {
    let session;
    try {
        session = await Session.findOne({clientToken: clientToken, sessionActive: true}, {
            conversations: 0,
            clientToken: 0,
            "_id": 0,
            "__v": 0
        })
    } catch (err) {
        console.log(err);
    }
    return session
}

async function getActiveSessionList() {
    return Session.find({sessionActive: true}, {conversations: 0, clientToken: 0, "_id": 0, "__v": 0})
}

async function getSessionList() {
    return Session.find({}, {conversations: 0, clientToken: 0, "_id": 0, "__v": 0})
}

function updateSession(clientToken, session) {
    return Session.findOneAndUpdate({clientToken: clientToken}, session, {
        "projection": {"_id": 0, "__v": 0},
        "new": true
    })
}

module.exports = ({createSession, getSessionDetails, getSessionByToken, updateSession, getActiveSessionList, getSessionList})