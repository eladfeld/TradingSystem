import React from 'react'
//import { Grid,Paper, TextField, Button, Typography,Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';
import { SERVER_BASE_URL } from '../constants';



const Enter = ({setAppState}) =>
{
    axios.get(`${SERVER_BASE_URL}enter`)
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
