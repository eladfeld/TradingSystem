import React, { useState } from 'react'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';

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

const open = async (userId, storeName, bankAccountNumber, storeAddress) =>
{
    const res = await axios.post('http://192.168.56.1:3333/command/openStore', {userId, storeName, bankAccountNumber, storeAddress})

}

export const OpenStore = ({getAppState, setAppState}) => {

    const [_storeName, setStoreName] = useState("");
    const [_storeBankAccount, setStoreBankAccount] = useState("");
    const [_storeAddress, setStoreAddress] = useState("");

    const classes = useStyles();

  return (
    <Container >
      <div className={classes.margin}>
      <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={5}/>
          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <TextField id="input-with-icon-grid" value={_storeName} label="Store name" onChange={(event) => setStoreName(event.target.value)}/>
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={5}/>
          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <TextField id="input-with-icon-grid" value={_storeBankAccount} label="Bank account number" onChange={(event) => setStoreBankAccount(event.target.value)}/>
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={5}/>

          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <TextField id="input-with-icon-grid" value={_storeAddress} label="Store address" onChange={(event) => setStoreAddress(event.target.value)}/>
          </Grid>
        </Grid>
      </div>
      <Grid container>
          <Grid item xs={5}/>
          <Grid item>
          <MuiThemeProvider theme={theme}>

        <ButtonGroup>
                <Button color='primary' variant="contained" onClick={(e) =>
                {
                    let userId = getAppState().userId;
                    let storeName = _storeName;
                    let bankAccountNumber = Number(_storeBankAccount);
                    let storeAddress = _storeAddress;
                    open(userId, storeName, bankAccountNumber, storeAddress)
                }}>
                    open new store
                </Button>
                <Button  variant="contained" color='secondary' onClick={(e) => {
                    setStoreName("");
                    setStoreBankAccount("");
                    setStoreAddress("");
                    }}>
                clear
                </Button>
        </ButtonGroup>
        </MuiThemeProvider>

        </Grid>
        
      </Grid>

    </Container>

  );
}
