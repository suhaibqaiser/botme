const express = require('express')
var bodyParser = require('body-parser');
const clientsRouter = require('./routes/clients.js')
const app = express()
const port = process.env.API_PORT || 3000;

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_CONNECTION || 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', verifyToken, clientsRouter);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if (bearerToken === 'ea2d3aeaad77865f9769974a920892f5') {
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
})
