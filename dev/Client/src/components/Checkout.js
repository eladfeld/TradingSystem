import { Grid,Paper, TextField, Button, Typography} from '@material-ui/core'
import axios from 'axios';
import { useState } from 'react';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';
import history from '../history';
import { areNonNegativeIntegers, areNotEmptyStrings } from './componentUtil';
import PaymentInfo from './PaymentInfo';
import ShippingInfo from './ShippingInfo';
import Alert from '@material-ui/lab/Alert';

const Checkout = ({getAppState, setAppState}) =>{
    const [shippingInfo,setShippingInfo] = useState({});
    const [paymentInfo, setPaymentInfo] = useState({});
    const [problem, setProblem] = useState("");
    const [success, setSuccess] = useState("");
    const resetFields = () =>{
        setShippingInfo({});
        setPaymentInfo({});
    }



    const {userId, basketAtCheckout, cart} = getAppState();

    const onCancelClick = () =>{
        history.push('/cart');
    }
    const onCompleteClick = async () =>{
        const {cardNumber, expMonth, expYear, holder, cvv, id} = paymentInfo;
        const {name, address, city, country, zip} = shippingInfo;
        if(!areNotEmptyStrings([holder,name,address,city,country])){
            setProblem("all fields are mandatory");
            return;            
        }
        if(!areNonNegativeIntegers([cardNumber, expMonth, expYear, cvv, id, zip])){
            setProblem("credit card info and zip code must be valid numbers");
            return;
        }
        //todo:remove
        paymentInfo.amount = '12345';
        paymentInfo.toAccount = '54321';

        //const response = await axios.post(SERVER_BASE_URL+'/completeOrder',{userId, storeId:basketAtCheckout, userAddress:"8Mile", paymentInfo});
        const response = await axios.post(SERVER_BASE_URL+'/completeOrder',{userId, storeId:basketAtCheckout, shippingInfo, paymentInfo});
        switch(response.status){
            case SERVER_RESPONSE_OK:
                cart.baskets = cart.baskets.filter(b => b.storeId !== basketAtCheckout);
                resetFields();
                setAppState({basketAtCheckout: undefined, cart});
                setSuccess('purchase was succesful!\nThank you, come again.');
                return;
            case SERVER_RESPONSE_BAD:
                setProblem(response.data);
                return;
            default:
                setProblem(`unexpected response code: ${response.status}`);
                return;
        }
    }

    const paperStyle={padding :20,height:"auto",width:"700px", margin:"20px auto"}
    const btnstyle={margin:'8px 0'}
    return(
        <div>                
            {
            problem !== "" ?
            <Alert
            action={
                <Button color="inherit" size="small" onClick={() => {setProblem("")}}>
                close
                </Button>
            }
            severity="error"> {problem}</Alert> : <a1></a1>
            }

            {   
            success !== "" ?
            <Alert
            action={
                <Button color="inherit" size="small" onClick={() => 
                {
                    setSuccess("");
                    history.push('/cart');
                }}>
                close
                </Button>
            }
            severity="success"> {success}</Alert> : 
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
            }
        </div>
    );
};

export default Checkout;