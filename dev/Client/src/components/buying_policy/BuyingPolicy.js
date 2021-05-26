import { Button, Grid, Paper, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import { SERVER_BASE_URL } from '../../constants';
import CompositePredicate from './CompositePredicate';
import Predicate from './Predicate';
import SimplePredicate from './SimplePredicate';

const BuyingPolicy = ({getAppState, setAppState, pred, policyName, isNewPolicy}) => {
    if(!policyName)policyName="";
    if(!pred) pred = {};
    const [name, setName] = useState(policyName);
    const [predicate, setPredicate] = useState(pred);
    const {userId, storeId} = getAppState();

    const onAddClick = async() => {//TODO: fix
        const response = await axios.post(SERVER_BASE_URL+'addBuyingPolicy', {
            userId,
            storeId,
            policyName:name,
            policy:predicate
        });
        alert(response.data);
        if(response.status == 200){
            setName("");
            setPredicate({});
        }
    }

    const btnstyle={margin:'8px 0'}
    const paperStyle={padding :20,width:'90%', margin:"20px auto"}
    return(
        <div>
            <h1>Buying Policy</h1>
            <Paper elevation={10} style={paperStyle}>
                <Grid container>
                    <Grid item xs={8}>
                        <TextField
                        label='Policy Name'
                        placeholder='Enter a policy name (i.e. No sales on saturday)'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        fullWidth/>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color="primary" style={btnstyle} onClick={onAddClick}>
                            Add
                        </Button>
                    </Grid>

                </Grid>

            </Paper>
            <Predicate getPredicateState={() => predicate} setPredicateState={setPredicate}/>
        </div>
    );
}

export default BuyingPolicy;