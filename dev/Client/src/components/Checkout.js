import { Grid,Paper, TextField, Button, Typography, Link, Divider } from '@material-ui/core'
import axios from 'axios';
import { useState } from 'react';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';
import history from '../history';

const Checkout = ({getAppState, setAppState, storeId}) =>{
    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    const btnstyle={margin:'8px 0'}

    const [userAddress, setUserAddress] = useState("");
    const [CardNumberText, setCardNumberText] = useState("");
    const [expirationText, setExpirationText] = useState("");
    const [cvvText, setCvvText] = useState("");

    const {userId, basketAtCheckout} = getAppState();

    const onCancelClick = () =>{
        history.push('/cart');
    }
    const onCompleteClick = async () =>{
        const paymentInfo = {cardNumber: CardNumberText, cvv: cvvText, expiraion:expirationText};
        const response = await axios.post(SERVER_BASE_URL+'/completeOrder',{userId, storeId:basketAtCheckout, supplyAddress: userAddress, paymentInfo});
        console.log("response - complete checkout: ", response);
        console.log('complete order:', response.data);
        switch(response.status){
            case SERVER_RESPONSE_OK:
                alert(response.data);
                setAppState({basketAtCheckout: undefined});
                history.push('/cart');
                return;
            case SERVER_RESPONSE_BAD:
                alert(response.data.message);
                return;
            default:
                alert(`unexpected response code: ${response.status}`);
                return;
        }
    }


    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Typography>Checkout</Typography>
                </Grid>
                <TextField 
                    label='Address' 
                    placeholder='Enter address' 
                    value={userAddress} 
                    onChange={(event) =>  setUserAddress(event.target.value)} 
                    fullWidth/>
                <TextField 
                    label='Card Number' 
                    placeholder='Enter Credit Card' 
                    value={CardNumberText} 
                    onChange={(event) => setCardNumberText(event.target.value)} 
                    fullWidth/>
                <TextField 
                    label='Expiration' 
                    placeholder='Enter expiration date' 
                    value={expirationText} 
                    onChange={(event) => setExpirationText(event.target.value)} 
                    fullWidth/>
                <TextField 
                    label='cvv' 
                    placeholder='Enter cvv' 
                    value={cvvText} 
                    onChange={(event) => setCvvText(event.target.value)} 
                    fullWidth/>
                <br/> <br/> 
                <Button type='submit' color='primary' variant="contained" style={btnstyle}
                    onClick={onCompleteClick} fullWidth>Complete</Button>
                <Button type='submit' color='secondary' variant="contained" style={btnstyle}
                    onClick={onCancelClick} fullWidth>Cancel</Button>

            </Paper>
        </Grid>
    );
};

export default Checkout;