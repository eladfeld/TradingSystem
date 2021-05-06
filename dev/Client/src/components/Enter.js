import React, { useState } from 'react'
//import { Grid,Paper, TextField, Button, Typography,Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';



const Enter = ({setAppState}) =>
{
    axios.get('http://192.168.56.1:3333/command/enter')
    .then((res) => {
        setAppState({userId: res.data.userId});
        history.push('/auth');
    });
    return(
        <div>
            <h1>
                loading...
            </h1>
        </div>
    )
}

export default Enter;
