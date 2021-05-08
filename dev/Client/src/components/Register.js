import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';
import { unknownStatusMessage } from './componentUtil';


const onBackClick = () =>{
    history.push('/auth');
}

const onRegisterClick = async (username, password, confirmPassword, age) =>
{
    if(password !== confirmPassword) {
        alert('passwords do not match');
        return;
    }
    const response = await axios.post(`${SERVER_BASE_URL}register`, {username, password, age: Number(age)} );
    console.log(response.data);
    switch(response.status){
        case SERVER_RESPONSE_OK:
            history.push('/auth');
            return;
        case SERVER_RESPONSE_BAD:
            alert(response.data.error);
            return;
        default:
            alert(unknownStatusMessage(response));
            return;
    }
}



const Register=({getAppState, setAppState})=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [age, setAge] = useState(0);
    const {userId} = getAppState();

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}

    const onGuestClick = () =>{
        setAppState({isGuest: true, username: 'guest'});
        history.push('/welcome');
    }

    return(
        <div>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    {/* <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar> */}
                    <h2>Register</h2>
                </Grid>
                <TextField
                    label='Username'
                    placeholder='Enter username'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                fullWidth/>
                <TextField
                    label='Password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type='password'
                fullWidth/>
                <TextField
                    label='Confirm Password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type='password'
                fullWidth/>
                <TextField
                    type="number"
                    label='Age'
                    placeholder='Enter your age'
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                fullWidth/>
                <Button type='submit' color='primary' variant="contained"
                    onClick={()=> onRegisterClick(username, password, confirmPassword, age)}
                    style={btnstyle} fullWidth>
                        Register
                </Button>
                <Button type='submit' color='primary' variant="contained"
                    onClick={()=> onBackClick()}
                    style={btnstyle} fullWidth>
                        Back to Login
                </Button>
                <Typography >
                    <Link href="#" onClick={onGuestClick}>
                        Continue as guest
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    </div>
    )
}

export default Register;



