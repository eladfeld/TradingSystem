import http from 'http';
import https from 'https';
import express from 'express';
import bodyParser from 'body-parser';
import Config from './config/config';
import  Route from './Router'
import fs  from 'fs';
import path from 'path';
import WebSocket from 'ws';
import Controller from './Controller';
import { Publisher } from '../DomainLayer/notifications/Publisher';
import { Service } from '../ServiceLayer/Service';



const initService = async ()=>
{
    await Controller.initSystem();
}

const run  = () =>
{
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

const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
  };


    let server = https.createServer(options,router);
    server.listen(Config.server.port, ()=> console.log(`https Server is running on ${Config.server.hostname}:${Config.server.port}`));
    const wss = new WebSocket.Server({server});

    wss.on("connection", WsConn => {
        WsConn.on("close", ()=>{
            wssConnections.forEach ( (value,key) => {
                if (value == WsConn)
                {
                    wssConnections.delete(key)
                }
            })
        })

        WsConn.on("message", data =>
        {
            let userId:number = Controller.getSubscriberId(String(data));
            if(userId > 0)
            {
                wssConnections.set(userId, WsConn);
            }
        })

    });


    const wssConnections: Map<number, WebSocket> = new Map();

    const messageSender = async (userId: number, message: string):Promise<string> =>
    {
        // console.log("message sent :)");
        let ws = wssConnections.get(userId);
        if(ws !== undefined)
        {
            ws.send(message);
            return  Promise.resolve( "fine")
        }
        // console.log("mesage didnt sent!");
        return Promise.reject("user not logged in");
    }

    Publisher.get_instance().set_send_func(messageSender)
}

initService().then(run)
