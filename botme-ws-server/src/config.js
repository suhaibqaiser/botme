var config = {}

config.port = process.env.WS_PORT || 6380;
config.apiServer = process.env.CLIENTS_API || 'http://localhost:3000/';
config.bearerToken = 'ea2d3aeaad77865f9769974a920892f5';
config.connectionString = 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';

module.exports = config;