var config = {}

config.port = process.env.WS_PORT || 6380;
config.apiServer = process.env.CLIENTS_API || 'http://localhost:3000/';
config.bearerToken = 'ea2d3aeaad77865f9769974a920892f5';

module.exports = config;