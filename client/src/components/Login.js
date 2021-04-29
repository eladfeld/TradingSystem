import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function Login() {
    const classes = useStyles();

    return (

        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                id="username-input"
                variant="filled"
                label="Username"
                />
            </div>
            <div>
                <TextField
                id="password-input"
                variant="filled"
                label="Password"
                type="password"
                />
            </div>
            <Button>
                
            </Button>
        </form>
  );
}
