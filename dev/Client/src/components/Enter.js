import React from 'react'
//import { Grid,Paper, TextField, Button, Typography,Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';
import { SERVER_BASE_URL } from '../constants';



const fs = require('fs');
const https = require('https');


const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false

    })
});


const Enter = ({setAppState}) =>
{
    instance.get(`${SERVER_BASE_URL}enter`)
    .then((res) => {
        setAppState({userId: res.data.userId});
        history.push('/auth');
    })
    .catch(error => {console.log(error);});
    return(
        <div>
            <h1>
                loading...
            </h1>
        </div>
    )
}

export default Enter;
