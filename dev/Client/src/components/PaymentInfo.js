import React, { useState } from 'react'
import { Grid,Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import history from '../history';
import {SERVER_BASE_URL} from '../constants'


const PaymentInfo=({paymentInfo, setPaymentInfo})=>{
    const {card_number, month, year, holder, ccv, id} = paymentInfo;//underscore notation for payment api consistency

    //const {userId} = getAppState();

    const paperStyle={padding :20,height:'auto',width:280, margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(

            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant="h5">Payment Information</Typography>
                </Grid>
                <TextField
                    label='Card Number'
                    placeholder='Enter your credit card number'
                    value={card_number}
                    onChange={(event) => setPaymentInfo({...paymentInfo, card_number:event.target.value})}
                    type="number"
                    fullWidth/>
                <TextField
                    label='Exp Month'
                    placeholder='Enter card expiration month'
                    value={month}
                    onChange={(event) => setPaymentInfo({...paymentInfo, month:event.target.value})}
                    fullWidth/>
                <TextField
                    label='Exp Year'
                    placeholder='Enter card expiration year'
                    value={year}
                    onChange={(event) => setPaymentInfo({...paymentInfo, year:event.target.value})}
                    fullWidth/>
                <TextField
                    label='CCV'
                    placeholder='Enter 3 digits on back of card'
                    value={ccv}
                    onChange={(event) => setPaymentInfo({...paymentInfo, ccv:event.target.value})}
                    fullWidth/>
                <TextField
                    label='Card Holder Name'
                    placeholder='Enter the name on the card'
                    value={holder}
                    onChange={(event) => setPaymentInfo({...paymentInfo, holder:event.target.value})}
                    fullWidth/>
                <TextField
                    label='Id Number'
                    placeholder='Enter your Id number'
                    value={id}
                    onChange={(event) => setPaymentInfo({...paymentInfo, id:event.target.value})}
                    fullWidth/>
            </Paper>

    )
}

export default PaymentInfo;



