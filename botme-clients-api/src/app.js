const express = require('express')

const jwt = require('jsonwebtoken')
const jwtKey = 'superSecretJWTKey'
const clientsRouter = require('./routes/clientsRouter.js')
const sessionRouter = require('./routes/sessionRouter')
const conversationRouter = require('./routes/conversationRouter')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const nlpRouter = require('./routes/nlpRouter.js')
const speechRouter = require('./routes/speechRouter')
const deviceRouter = require('./routes/deviceRouter')
const emailRouter = require('./routes/emailRouter')
const db = require('./utils/mongodb');

const app = express()
const port = process.env.API_PORT || 3000;
const cors = require('cors')

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/client', verifyToken, clientsRouter);
app.use('/session', verifyToken, sessionRouter);
app.use('/conversation', verifyToken, conversationRouter);
app.use('/user', userRouter);
app.use('/nlp', verifyToken, nlpRouter);
app.use('/speech', speechRouter);
app.use('/auth', authRouter);
app.use('/device', verifyToken, deviceRouter);
app.use('/email', verifyToken, emailRouter);


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

app.listen(port, async () => {
    console.log(`API listening at http://localhost:${port}`)
    await db.init();
})
