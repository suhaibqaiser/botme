const commService = require('./communicationService');

async function login(username, password) {
    return await commService.fetchToken(username, password);
}

module.exports = ({login})