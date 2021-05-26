import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import Predicate from '../buying_policy/Predicate';



const ConditionalDiscount=({getDiscountState,setDiscountState})=>{
    const discount = getDiscountState();
    const {category, ratio} = discount;
    const predicate = discount.predicate? discount.predicate : {};

    const paperStyle={padding :20,width:'90%', margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Paper elevation={10} style={paperStyle}>
        <h3>Conditional</h3>
        <Grid container>
                <Grid item xs={5}>
                    <TextField
                        label='items on sale'
                        placeholder='Enter a category name or product serial number'
                        value={category}
                        onChange={(event) => setDiscountState({...discount, category:event.target.value})}
                        />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label='sale percentage'
                        placeholder='Enter a number between 0 and 1'
                        value={ratio}
                        onChange={(event) => setDiscountState({...discount, ratio:event.target.value})}
                        />
                </Grid>
        </Grid>
        <Grid container> 
            <Predicate getPredicateState={() => predicate} setPredicateState={(p) => setDiscountState({...discount, predicate:p})}/>
        </Grid>
        </Paper>
    )
}

export default ConditionalDiscount;



