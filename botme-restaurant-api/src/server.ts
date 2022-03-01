import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import foodRoutes from "./modules/food";
import dictionaryRoutes from "./modules/dictionary";
import testsRoutes from "./modules/tests";
import { initDependencies } from './config';
import fileUpload from 'express-fileupload';
import notificationsRoutes from './modules/notification'

const bodyParser = require('body-parser');
const cors = require('cors');
const router = express();
router.use(fileUpload());
router.use(cors());
router.use(bodyParser.json());

applyMiddleware(middleware, router);
applyRoutes('/food', foodRoutes, router);
applyRoutes('/dictionary', dictionaryRoutes, router);
applyRoutes('/tests', testsRoutes, router);
applyRoutes('/notification',notificationsRoutes, router);


const { PORT = 3100 } = process.env;
const server = http.createServer(router);


async function start() {    
    await initDependencies();
    server.listen(PORT, () =>
        console.log(`Server is running http://localhost:${PORT}...`))
}

start();