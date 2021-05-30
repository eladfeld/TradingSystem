import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';
import {SERVER_BASE_URL} from '../constants'

// (alias) type tShippingInfo = {
//     name: string;
//     address: string;
//     city: string;
//     country: string;
//     zip: number;
// }
const ShippingInfo=({shippingInfo, setShippingInfo })=>{
    const {name, address, city, country, zip} = shippingInfo;

    //const {userId} = getAppState();

    const paperStyle={padding :20,height:'auto',width:280, margin:"20px auto", align:""}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant="h5">Shipping Information</Typography>
                </Grid>
                <TextField
                    label='Name'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(event) => setShippingInfo({...shippingInfo, name:event.target.value})}
                    fullWidth/>
                <TextField
                    label='Address'
                    placeholder='Enter your address'
                    value={address}
                    onChange={(event) => setShippingInfo({...shippingInfo, address:event.target.value})}
                    fullWidth/>
                <TextField
                    label='City'
                    placeholder='Enter your city'
                    value={city}
                    onChange={(event) => setShippingInfo({...shippingInfo, city:event.target.value})}
                    fullWidth/>
                <TextField
                    label='Country'
                    placeholder='Enter your country'
                    value={country}
                    onChange={(event) => setShippingInfo({...shippingInfo, country:event.target.value})}
                    fullWidth/>
                <TextField
                    label='Zip Code'
                    placeholder='Enter your zip code'
                    value={zip}
                    onChange={(event) => setShippingInfo({...shippingInfo, zip:event.target.value})}
                    fullWidth/>
            </Paper>

    )
}

export default ShippingInfo;



