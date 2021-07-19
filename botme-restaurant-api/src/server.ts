import http from "http";
import express from "express";
import cors from "cors";
import {applyMiddleware, applyRoutes} from "./utils";
import middleware from "./middleware";
import routes from "./modules";
import {initDependencies} from './config';


const router = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.use(cors(corsOptions));
applyMiddleware(middleware, router);
applyRoutes(routes, router);

const {PORT = 3100} = process.env;
const server = http.createServer(router);

async function start() {
    await initDependencies();
    server.listen(PORT, () =>
        console.log(`Server is running http://localhost:${PORT}...`))
}

start();
