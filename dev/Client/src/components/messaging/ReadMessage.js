import React from 'react'
import { Grid,Paper, Button, Typography} from '@material-ui/core'



const ReadMessage=({message, onReplyClick, onDeleteClick})=>{
    const {title, body, authorName, authorId} = message;
    //const {userId} = getAppState();

    const paperStyle={padding :20,height:'auto',width:'auto', margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <div>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='left'>
                    <Typography>{title}</Typography>
                </Grid>
                <Typography>
                    <pre style={{ fontFamily: 'inherit' }}>
                        {body}
                    </pre>
                </Typography>
                <Typography>
                    {authorName}
                </Typography>
                <Button type='submit' color='primary' variant="contained" onClick={()=> onReplyClick()} style={btnstyle} fullWidth>Reply</Button>
                <Button type='submit' color='secondary' variant="contained" onClick={()=> onDeleteClick()} style={btnstyle} fullWidth>Delete</Button>
            </Paper>
        </Grid>
    </div>
    )
}

export default ReadMessage;



