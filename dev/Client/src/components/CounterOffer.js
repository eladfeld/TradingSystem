import React, { useState } from 'react'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import { Button, ButtonGroup, Container, Paper, Typography, Link } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import history from '../history';
import Alert from '@material-ui/lab/Alert';
import Banner from './Banner';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../constants';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00a152',
    },
    secondary: {
      main: '#d50000',
    },
  },
});
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

//style:
const paperStyle={padding :20,height:'70vh',width:400, margin:"20px auto"}
const btnstyle={margin:'8px 0'}





export const CounterOffer = ({getAppState, setAppState, setPage, offer}) => {

    const [_ManagerUsername, setManagerUsername] = useState("");
    const [_isSucsess, setIsSucsess] = useState(false);
    const [_hasProblem, setHasProblem] = useState(false);
    const [problem, setProblem] = useState("");
    let storeId = getAppState().storeId
    let userId = getAppState().userId
    const [counterOffer, setCounterOffer] = useState(0)

    const classes = useStyles();

    const onBuyAcceptedOffer = async (storeId, offerId) =>{
      const {userId} = getAppState();
      const response = await axios.post(SERVER_BASE_URL+'buyAcceptedOffer',{userId, storeId, offerId});
      switch(response.status){
          case SERVER_RESPONSE_OK:
              setAppState({basketAtCheckout:storeId});
              history.push('/checkout');
              return;
          case SERVER_RESPONSE_BAD:
              setProblem(response.data);
              return;
          default:
              setProblem(`unexpected response code: ${response.status}`);
              return;
      }
  }

    console.log(offer)
  return (
      <div className={classes.margin}>
      <div>
      <Banner getAppState={getAppState} setAppState={setAppState}/>
        {_isSucsess ?
        <Alert
        action={
          <Button color="inherit" size="small" onClick={() => {history.push('/welcome')}}>
            Back
          </Button>
        }
      >
        Manager Added sussfully!
      </Alert> :
      _hasProblem ?
      <Alert severity="warning">A problem accured while adding the manager: {problem}!</Alert>
      :<Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <h2>counter offer</h2>
                </Grid>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={12}>
                            <TextField disabled id="standard-disabled" label="product name" defaultValue={offer.productName} />
                    </Grid>
                    <Grid item xs={12}>
                            <TextField disabled id="standard-disabled" label="counter offer" defaultValue={offer.counterPrice} />
                    </Grid>
                  </Grid>
              <MuiThemeProvider theme={theme}>
                <Button type='submit' color='primary' variant="contained"  style={btnstyle}
                    onClick={(e) =>
                    {
                      onBuyAcceptedOffer(storeId, offer.offerId)
                    }}
                  fullWidth>approve and checkout
                </Button>
                  <Button type='submit' color='secondary' variant="contained"  style={btnstyle}
                  onClick={(e) =>
                    {
                      axios.post(SERVER_BASE_URL+'/declineOffer', {userId, storeId, offerId: offer.offerId})
                    }}
                    fullWidth>decline
                  </Button>
                <Typography >
                    <Button onClick={() => {setPage("offers");}} >
                        back
                    </Button>
                </Typography>
                </MuiThemeProvider>

            </Paper>
        </Grid>
                }

    </div>
  </div>
  );
}

export default CounterOffer;