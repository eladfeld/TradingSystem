import http from 'http';
import https from 'https';
import express from 'express';
import bodyParser from 'body-parser';
import Config from './config/config';
import {Logger} from '../Logger'
import { config } from 'dotenv/types';
import  Route from './Router'

const router = express();


/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});


// Routes

router.use('/command', Route);


// Error handling 
router.use((req, res, next) => {
    const error = new Error('command not found');

    res.status(404).json({
        message: error.message
    });
});



// create the server
const httpServer = http.createServer(router);

httpServer.listen(Config.server.port, () => console.log(`Server is running on ${Config.server.hostname}:${Config.server.port}`));

// const httpsServer = https.createServer({
//     key: '',
//     cert
// },
// router);

// httpServer.listen(Config.server.port, () => console.log(`https Server is running on ${Config.server.hostname}:${Config.server.port}`))