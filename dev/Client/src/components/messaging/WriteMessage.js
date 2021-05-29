import React from 'react'
import { Grid,Paper, TextField, Button} from '@material-ui/core'



const WriteMessage=({getMessage, setMessage, onSendClick, onCancelClick})=>{
    const message = getMessage();
    const paperStyle={padding :20,height:'auto',width:'auto', margin:"20px auto"}
    const btnstyle={margin:'8px 0'}

    return(
        <div>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <TextField
                    label='Title'
                    placeholder='Enter the message title'
                    value={message.title}
                    onChange={(event) => setMessage({...message, title:event.target.value})}
                    margin="16px"
                    fullWidth/>
                <br/><br/>
                <TextField
                    label='Detail'
                    placeholder='Fill in the message body'
                    multiline
                    rows={4}
                    value={message.body}
                    onChange={(event) => setMessage({...message, body:event.target.value})}
                    variant="outlined"
                    fullWidth
                    />
                <Button type='submit' color='primary' variant="contained" onClick={onSendClick} style={btnstyle} fullWidth>Send</Button>
                <Button type='submit' color='secondary' variant="contained" onClick={onCancelClick} style={btnstyle} fullWidth>Cancel</Button>
            </Paper>
        </Grid>
    </div>
    )
}

export default WriteMessage;



