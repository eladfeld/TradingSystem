import { Button, Grid, Paper, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import { SERVER_BASE_URL } from '../../constants';
import Discount from './Discount';

const DiscountPolicy = ({getAppState, setAppState, disc, discountName, isNew}) => {
    // if(isNew){
    //     discountName = "";
    //     disc = {};
    // }
    if(!discountName)discountName="";
    if(!disc) disc = {};
    const [name, setName] = useState(discountName);
    const [discount, setDiscount] = useState(disc);
    const {userId, storeId} = getAppState();

    const onAddClick = async() => {//TODO: fix
        const response = await axios.post(SERVER_BASE_URL+'addDiscountPolicy', {
            userId,
            storeId,
            discountName:name,
            discount
        });
        alert(response.data);
        if(response.status == 200){
            setName("");
            setDiscount({});
        }
    }

    const btnstyle={margin:'8px 0'}
    const paperStyle={padding :20,width:'90%', margin:"20px auto"}
    return(
        <div>
            <h1>Discount Policy</h1>
            <Paper elevation={10} style={paperStyle}>
                <Grid container>
                    <Grid item xs={8}>
                        <TextField
                        label='Discount Name'
                        placeholder='Enter a discount name (i.e. 10% off Fruit)'
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
            <Discount getDiscountState={() => discount} setDiscountState={setDiscount}/>
        </div>
    );
}

export default DiscountPolicy;