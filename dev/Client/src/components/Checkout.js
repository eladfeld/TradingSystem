import { Grid,Paper, TextField, Button, Typography} from '@material-ui/core'
import axios from 'axios';
import { useState } from 'react';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';
import history from '../history';
import { areNonNegativeIntegers, areNotEmptyStrings } from './componentUtil';
import PaymentInfo from './PaymentInfo';
import ShippingInfo from './ShippingInfo';

const Checkout = ({getAppState, setAppState}) =>{
    const [shippingInfo,setShippingInfo] = useState({});
    const [paymentInfo, setPaymentInfo] = useState({});
    const resetFields = () =>{
        setShippingInfo({});
        setPaymentInfo({});
    }



    const {userId, basketAtCheckout, cart} = getAppState();

    const onCancelClick = () =>{
        history.push('/cart');
    }
    const onCompleteClick = async () =>{
        const {card_number,month, year, holder, ccv, id} = paymentInfo;
        const {name, address, city, country, zip} = shippingInfo;
        if(!areNotEmptyStrings([holder,name,address,city,country])){
            alert("you must fill in all fields");
            return;            
        }
        if(!areNonNegativeIntegers([card_number, month, year, ccv, id, zip])){
            alert("credit card info and zip code must be valid numbers");
            return;
        }

        const response = await axios.post(SERVER_BASE_URL+'/completeOrder',{userId, storeId:basketAtCheckout, userAddress:"8Mile", paymentInfo});
        //const response = await axios.post(SERVER_BASE_URL+'/completeOrder',{userId, storeId:basketAtCheckout, shippingInfo, paymentInfo});
        switch(response.status){
            case SERVER_RESPONSE_OK:
                cart.baskets = cart.baskets.filter(b => b.storeId !== basketAtCheckout);
                resetFields();
                setAppState({basketAtCheckout: undefined, cart});
                alert('purchase was succesful!\nThank you, come again.');
                history.push('/cart');
                return;
            case SERVER_RESPONSE_BAD:
                alert(response.data);
                return;
            default:
                alert(`unexpected response code: ${response.status}`);
                return;
        }
    }

    const paperStyle={padding :20,height:"auto",width:"700px", margin:"20px auto"}
    const btnstyle={margin:'8px 0'}
    return(
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant="h3">Checkout</Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={6}>
                        <ShippingInfo shippingInfo={shippingInfo} setShippingInfo={setShippingInfo}/>
                    </Grid>
                    <Grid item xs={6}>
                        <PaymentInfo  paymentInfo = {paymentInfo} setPaymentInfo = {setPaymentInfo}/>
                    </Grid>
                </Grid>
                <br/> <br/> 
                <Button type='submit' color='primary' variant="contained" style={btnstyle}
                    onClick={onCompleteClick} fullWidth>Complete</Button>
                <Button type='submit' color='secondary' variant="contained" style={btnstyle}
                    onClick={onCancelClick} fullWidth>Cancel</Button>
            </Paper>
    );
};

export default Checkout;