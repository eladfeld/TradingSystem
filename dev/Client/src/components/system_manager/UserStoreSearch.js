import React, { useState } from 'react'
import { Grid,Paper, TextField, Button} from '@material-ui/core'





const UserStoreSearch=({onSearchUserClick, onSearchStoreClick})=>{
    const [text, setText] = useState("")

    const paperStyle={padding :20,height:"auto",width:"auto", margin:"20px auto"}
    const btnstyle={margin:'8px 0'}

    return(
        <div>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <h2>Search</h2>
                </Grid>
                <TextField
                    label='Username or Store'
                    placeholder='Enter user id or Store id'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    fullWidth/>
                <Button type='submit' color='primary' variant="contained" onClick={()=> onSearchUserClick(text)} style={btnstyle} fullWidth>
                    Search User
                </Button>
                <Button type='submit' color='primary' variant="contained" onClick={()=> onSearchStoreClick(text)} style={btnstyle} fullWidth>
                    Search Store
                </Button>
            </Paper>
        </Grid>
    </div>
    )
}

export default UserStoreSearch;





