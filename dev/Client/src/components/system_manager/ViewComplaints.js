import { Grid,Paper,Typography} from '@material-ui/core'
import ProgressWheel from '../ProgreeWheel';
import ViewComplaint from './ViewComplaint';

const ViewComplaints = ({getAppState, setAppState}) =>{
    const {complaints} = getAppState();

    if(!complaints)return <ProgressWheel/>;
    const paperStyle={padding :20,height:"auto",width:"700px", margin:"20px auto"}
    const btnstyle={margin:'8px 0'}
    
    return(
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant="h3">Subscriber Complaints</Typography>
                </Grid>
                {
                    complaints.map(c => <ViewComplaint getAppState={getAppState} setAppState={setAppState} message={c}/>)
                }
                <br/> <br/> 
            </Paper>
    );
};

export default ViewComplaints;