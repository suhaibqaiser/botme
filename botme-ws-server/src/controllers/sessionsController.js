const session = require('../services/sessionService');

async function getSession(clientToken) {
    console.log(await session.getSession(clientToken))
}

getSession('VY7oV9S4EsT+59Gf4suCvsDQ5B1KCl6AUJH7/jA9BaQ=');
//module.exports(getSession())