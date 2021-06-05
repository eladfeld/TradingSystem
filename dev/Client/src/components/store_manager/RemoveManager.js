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
const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
const btnstyle={margin:'8px 0'}





export const DeleteManager = ({getAppState, setAppState}) => {

    const [_storeName, setStoreName] = useState("");
    const [_managerUsername, setManagerUsername] = useState("");
    const [_isSucsess, setIsSucsess] = useState(false);
    const [_hasProblem, setHasProblem] = useState(false);
    const [problem, setProblem] = useState("");
    let storeId = getAppState().storeId
    let userId = getAppState().userId



    const classes = useStyles();

    const DeleteManager = async (managerToRemove) =>
    {
        axios.post(`${SERVER_BASE_URL}deleteManagerFromStore`, {userId, storeId, managerToRemove})
        .then(res => {
          if(res.status == 200){
            setIsSucsess(true);
          }
          else if(res.status == 201)
          {
            setHasProblem(true);
            setProblem(res.data);
            clearFields();
          }
        })
        .catch()
    }
    const clearFields = () =>
    {
        setManagerUsername("");
    }

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
        manager deleted sussfully!
      </Alert> :
      _hasProblem ?
      <Alert severity="warning">A problem accured while deleting the manager: {problem}!</Alert>


      :<Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <h2>delete store manager</h2>
                </Grid>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <HomeIcon />
                    </Grid>
                    <Grid item>
                      <TextField
                          label='manager username'
                          placeholder='Enter username to remove'
                          onChange={(event) => setManagerUsername(event.target.value)}
                      fullWidth/>
                    </Grid>
                  </Grid>
              <MuiThemeProvider theme={theme}>
                <Button type='submit' color='primary' variant="contained"  style={btnstyle}
                    onClick={(e) =>
                    {
                        DeleteManager(_managerUsername)
                    }}
                  fullWidth>remove manager
                </Button>
                  <Button type='submit' color='secondary' variant="contained"  style={btnstyle}
                  onClick={(e) => clearFields()}
                    fullWidth>clear
                  </Button>
                <Typography >
                    <Button onClick={() => {history.push('/welcome');}} >
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

export default DeleteManager;
