import React, { useState } from 'react'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import { Button, ButtonGroup, Container, Paper, Typography, Link } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import history from '../../history';
import Alert from '@material-ui/lab/Alert';
import { SERVER_BASE_URL } from '../../constants';

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





export const Offer = ({getAppState, setAppState, setPage}) => {

    const [_ManagerUsername, setManagerUsername] = useState("");
    const [_isSucsess, setIsSucsess] = useState(false);
    const [_hasProblem, setHasProblem] = useState(false);
    const [problem, setProblem] = useState("");
    let storeId = getAppState().storeId
    let userId = getAppState().userId
    const { offer } = getAppState();
    const [counterOffer, setCounterOffer] = useState(0)
    const classes = useStyles();


  return (
      <div className={classes.margin}>
      <div>
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
                    <h2>manage offer</h2>
                </Grid>
                  <Grid container spacing={1} alignItems="flex-end">

                    <Grid item xs={12}>
                            <TextField disabled id="standard-disabled" label="username" defaultValue={offer.username} />
                    </Grid>

                    <Grid item xs={12}>
                            <TextField disabled id="standard-disabled" label="product name" defaultValue={offer.productName} />
                    </Grid>
                    <Grid item xs={12}>
                            <TextField disabled id="standard-disabled" label="bid" defaultValue={offer.bid} />
                    </Grid>
                    <Grid item>
                        <TextField
                        id="standard-number"
                        label="counter offer"
                        type="number"
                        value={counterOffer}
                        onChange={(e) => setCounterOffer(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                    </Grid>
                    <Grid item>
                    <Button variant="contained" onClick={() => 
                    {
                        axios.post(SERVER_BASE_URL+'/counterOffer', {userId, storeId, offerId: offer.offerId, counterOffer: Number(counterOffer)})
                    }} >
                        sand counter offer 
                    </Button>
                    </Grid>
                  </Grid>
              <MuiThemeProvider theme={theme}>
                <Button type='submit' color='primary' variant="contained"  style={btnstyle}
                    onClick={(e) =>
                    {
                        axios.post(SERVER_BASE_URL+'/acceptOffer', {userId, storeId, offerId: offer.offerId})
                    }}
                  fullWidth>approve
                </Button>
                  <Button type='submit' color='secondary' variant="contained"  style={btnstyle}
                  onClick={(e) =>
                    {
                        axios.post(SERVER_BASE_URL+'/declineOffer', {userId, storeId, offerId: offer.offerId})
                    }}
                    fullWidth>decline
                  </Button>
                <Typography >
                    <Button onClick={() => {setPage("offer_manager");}} >
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

export default Offer;