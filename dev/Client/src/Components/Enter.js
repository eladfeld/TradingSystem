import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography,Link } from '@material-ui/core'
import axios from 'axios';



const Enter = ({setUserId}) =>
{
    alert("oyooyoy")
    axios.get('http://192.168.56.1:3333/command/enter').then((res) => setUserId(res.data.userId))
    return(
        <div>
            <h1>
                loading...
            </h1>
        </div>
    )
}

export default Enter;
