import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../../history';
import {SERVER_BASE_URL} from '../../constants'


const onRegisterClick = async () =>
{
    history.push('/register');
}

const Operand=({getAppState, setAppState})=>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    //const {userId} = getAppState();
    

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(

        <Grid container>
                <Grid item xs={6}>
                    <TextField
                        label='Username'
                        placeholder='Enter username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        fullWidth/>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label='Password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type='password'
                        fullWidth/>
                </Grid>

            {/* <Paper elevation={10} style={paperStyle}>
            </Paper> */}
        </Grid>
    )
}

export default Operand;



