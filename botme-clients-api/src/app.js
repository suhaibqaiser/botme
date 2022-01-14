const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const jwtKey = 'superSecretJWTKey'
const clientsRouter = require('./routes/clientsRouter.js')
const sessionRouter = require('./routes/sessionRouter')
const conversationRouter = require('./routes/conversationRouter')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const speechRouter = require('./routes/speechRouter')

const app = express()
const port = process.env.API_PORT || 3000;
const cors = require('cors')

console.log(process.env.NODE_ENV)
console.log(config.get('clientsDB'))

//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_CONNECTION || `mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/${config.get('clientsDB')}?retryWrites=true&w=majority`;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    promoteBuffers: true
});
const db = mongoose.connection;
db.once("open", function () {
    console.log("Connected to MongoDB Server");
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/client', verifyToken, clientsRouter);
app.use('/session', verifyToken, sessionRouter);
app.use('/conversation', verifyToken, conversationRouter);
app.use('/user', verifyToken, userRouter);
app.use('/speech', speechRouter);
app.use('/auth', authRouter);


function verifyToken(req, res, next) {
    let currentDate = new Date();
    //if (!req.get('Request-Type')) return res.status(401).send('Unauthorized. Request type cannot be blank')
    if (!req.headers.authorization) return res.status(401).send('Unauthorized. Authorization header cannot be blank')
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') return res.status(401).send('Unauthorized. Auth Token cannot be blank')
    if (req.get('Request-Type') === 'client') {
        if (!jwt.decode(token)) return res.status(401).send('Unauthorized. Invalid JWT Token')
        let payload = jwt.verify(token, jwtKey)
        if (!payload) return res.status(401).send('Unauthorized')
        if (new Date(payload.expiresAt) < currentDate) return res.status(401).send('Unauthorized. Session Expired')
        req.userId = payload.subject
        next()
    } else {
        if (token != 'ea2d3aeaad77865f9769974a920892f5') return res.status(401).send('Unauthorized')
        next()
    }
}

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
})
