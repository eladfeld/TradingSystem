import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';
import {SERVER_BASE_URL , SERVER_RESPONSE_OK, SERVER_RESPONSE_BAD} from '../constants'


const onRegisterClick = async () =>
{
    history.push('/register');
}

const Authentication=({getAppState, setAppState})=>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {userId} = getAppState();
    




    const login = async (userId, username, password) =>
    {
        
        const res = await axios.post(`${SERVER_BASE_URL}login`, {userId, username, password} )
        if(res.data.userId !== undefined)
        {
            const ws  = new WebSocket('wss://localhost:3333');

            ws.addEventListener("open", ()=> 
            {
                ws.send(res.data.userId);
                setAppState({wsConn: ws})
            })

            ws.addEventListener("message", e => 
            {
                getAppState().notifications.push(e.data)
                setAppState({notifications: getAppState().notifications})
            })
            setAppState({userId: res.data.userId, username: res.data.username, isGuest: false});


            let stores_res = await axios.post(SERVER_BASE_URL+'/getUserStores',{userId});
            if (stores_res.status == SERVER_RESPONSE_OK)
            {
                const stores = JSON.parse(stores_res.data).stores;
                stores.length === 0 ?  setAppState({IsStoreManager : false}) :  setAppState({IsStoreManager : true})
            }

            axios.post(SERVER_BASE_URL+'/getCartInfo',{userId}).then(response =>
                {
                    switch(response.status){
                        case SERVER_RESPONSE_OK:
                            const cart = JSON.parse(response.data);
                            setAppState({cart});
                            break;
                        case SERVER_RESPONSE_BAD:
                            alert(response.data.message);
                            break;
                        default:
                            alert(`unexpected response code: ${response.status}`);
                            break;
                    }
                } )
              
              
            history.push('/welcome');
        }
        else
        {
            alert("could not log in")
        }
    }

    const onGuestClick = () =>{
        setAppState({isGuest: true, username: 'guest'});
        history.push('/welcome');
    }

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <div>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    {/* <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar> */}
                    <h2>Login</h2>
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
                <Button type='submit' color='primary' variant="contained" onClick={()=> login(userId, username, password)} style={btnstyle} fullWidth>Sign in</Button>
                <Typography >
                    {"Don't have an account?  "}
                    <Link href="#" onClick={onRegisterClick}>
                        Sign up
                    </Link>
                </Typography>
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

export default Authentication;



