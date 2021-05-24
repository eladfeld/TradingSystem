import { Button, Grid, Paper, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import CompositePredicate from './CompositePredicate';
import Predicate from './Predicate';
import SimplePredicate from './SimplePredicate';

const BuyingPolicy = ({pred, policyName}) => {
    if(!policyName)policyName="";
    const [name, setName] = useState(policyName);
    const [predicate, setPredicate] = useState(pred);
    console.log('[t] predicate:',predicate);

    const onSaveClick = () => {
        console.log(`[t] saving policy:`, predicate);
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
                        <Button variant="contained" color="primary" style={btnstyle} onClick={onSaveClick}>
                            Save
                        </Button>
                    </Grid>

                </Grid>

            </Paper>
            <Predicate getPredicateState={() => predicate} setPredicateState={setPredicate}/>
        </div>
    );
}

export default BuyingPolicy;