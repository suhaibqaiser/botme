import {init as initDb} from './mongoDB';

const initDependencies = async () => {
    await initDb();
};

export {initDependencies};