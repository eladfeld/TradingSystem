// import { Grid,Paper, TextField, Button, Typography} from '@material-ui/core'
// import axios from 'axios';
// import { useState } from 'react';
// import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';
// import history from '../history';
// import { areNonNegativeIntegers } from './componentUtil';
// import PaymentInfo from './PaymentInfo';
// import ProgressWheel from './ProgreeWheel';
// import ReadMessage from './ReadMessage';
// import ShippingInfo from './ShippingInfo';

// const Inbox = ({getAppState, setAppState}) =>{
//     const {userId, complaints} = getAppState();


//     if(!complaints)return <ProgressWheel/>;
//     const paperStyle={padding :20,height:"auto",width:"700px", margin:"20px auto"}
//     const btnstyle={margin:'8px 0'}
//     return(
//             <Paper elevation={10} style={paperStyle}>
//                 <Grid align='center'>
//                     <Typography variant="h3">Subscriber Complaints</Typography>
//                 </Grid>
//                 {
//                     complaints.map(c => <ReadMessage message={c}/>)
//                 }
//                 <br/> <br/> 
//             </Paper>
//     );
// };

// export default Inbox;