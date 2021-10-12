var config = {}

config.port = process.env.WS_PORT || 6380;
config.clientsAPI = process.env.CLIENTS_API || 'http://localhost:3000/';
config.restaurantAPI = process.env.RESTAURTANT_API || 'http://localhost:3100';
config.rasaAPI = process.env.RASA_API || 'http://localhost:5005'
config.bearerToken = 'ea2d3aeaad77865f9769974a920892f5';
config.connectionString = 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';
config.commandapi = 'http://127.0.0.1:5010'

module.exports = config;