import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../../history';
import {SERVER_BASE_URL} from '../../constants'


const onRegisterClick = async () =>
{
    history.push('/register');
}

const SimplePredicate=({getPredicateState, setPredicateState})=>{
    const predicate = getPredicateState();
    const {operand1, operator, operand2} = predicate;

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(

        <Grid container>
                <Grid item xs={5}>
                    <TextField
                        label='Operand1'
                        placeholder='Enter first operand'
                        value={operand1}
                        onChange={(event) => setPredicateState({...predicate, operand1:event.target.value})}
                        fullWidth/>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label='Operator'
                        placeholder='Enter operator'
                        value={operator}
                        onChange={(event) => setPredicateState({...predicate, operator:event.target.value})}
                        fullWidth/>
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        label='Operand2'
                        placeholder='Enter second operand'
                        value={operand2}
                        onChange={(event) => setPredicateState({...predicate, operand2:event.target.value})}
                        fullWidth/>
                </Grid>

            {/* <Paper elevation={10} style={paperStyle}>
            </Paper> */}
        </Grid>
    )
}

export default SimplePredicate;



