import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../../history';
import {SERVER_BASE_URL} from '../../constants'


const onRegisterClick = async () =>
{
    history.push('/register');
}

const NoTypePredicate=({getPredicateState, setPredicateState})=>{
    const predicate = getPredicateState();
    const {type} = predicate;

    const paperStyle={padding :20,width:'90%', margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(

        <Grid container>
            <Paper elevation={10} style={paperStyle}>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label='Type'
                        placeholder='Enter predicate type simple or composite'
                        value={type}
                        onChange={(event) => setPredicateState({...predicate, type:event.target.value})}
                        fullWidth/>
                </Grid>
                <Grid item xs={3}>
                </Grid>

            </Paper>
        </Grid>
    )
}

export default NoTypePredicate;



