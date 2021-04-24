import React from 'react'
import {connect} from 'react-redux';
import { Grid,Paper, TextField, Button, Typography,Link } from '@material-ui/core'

const Authentication=()=>{

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    {/* <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar> */}
                    <h2>Login</h2>
                </Grid>
                <TextField label='Username' placeholder='Enter username' fullWidth/>
                <TextField label='Password' placeholder='Enter password' type='password' fullWidth/>
                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Register</Button>
                <Typography >
                    <Link href="#" >
                        Continue as guest
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

const mapStateToProps = (state) =>{
    return {};
}

export default connect(mapStateToProps)(Authentication);