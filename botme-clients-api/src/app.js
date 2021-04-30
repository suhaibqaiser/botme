const express = require('express')
const clientsRouter = require('./routes/clientsRouter.js')
const nlpRouter = require('./routes/nlpRouter.js')
const entityRouter = require('./routes/entityRouter')
const corpusRouter = require('./routes/corpusRouter')
const sessionRouter = require('./routes/sessionRouter')
const conversationRouter = require('./routes/conversationRouter')
const authRouter = require('./routes/authRouter')
const app = express()
const port = process.env.API_PORT || 3000;
let cors = require('cors')

//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_CONNECTION || 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/client', verifyToken, clientsRouter);
app.use('/nlp', verifyToken, nlpRouter);
app.use('/entity', verifyToken, entityRouter);
app.use('/corpus', verifyToken, corpusRouter);
app.use('/session', verifyToken, sessionRouter);
app.use('/conversation', verifyToken, conversationRouter);
app.use('/auth', verifyToken, authRouter);

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
