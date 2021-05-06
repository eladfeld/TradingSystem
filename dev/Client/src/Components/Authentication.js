import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography,Link } from '@material-ui/core'
import axios from 'axios';


const register = async (username, password) =>
{
    const res = await axios.post('http://192.168.56.1:3333/command/register', {username, password} )
    alert(res.data.message)
}



const Authentication=({userId, setUserId})=>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const login = async (userId, username, password) =>
    {
        const res = await axios.post('http://192.168.56.1:3333/command/login', {userId, username, password} )
        if(res.data.userId !== undefined)
        {
            setUserId(res.data.userId)
        }
        else
        {
            alert("could not log in")
        }
    }

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <div>
            <h1>
                {
                    userId
                }
            </h1>
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
                <Button type='submit' color='primary' variant="contained" onClick={()=> register(username, password)} style={btnstyle} fullWidth>Register</Button>
                <Typography >
                    <Link href="#" >
                        Continue as guest
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    </div>
    )
}

export default Authentication;



