import {List, ListSubheader, ListItemText, ListItem, Grid, Button, Container } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React, { useState } from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {removeFromCart} from '../actions/guest';
import axios from 'axios';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../constants';
import Banner from './Banner';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      alignContent: 'center',
      overflow: 'auto',
      maxHeight: 600,
      maxWidth: 1200
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
}));


//TODO: FIX the multiple fetchCart requests issue
const Cart = ({getAppState, setAppState}) => {
    const classes = useStyles();
    const [cart, setCart] = useState(null);
    const {userId} = getAppState();

    
    const fetchCart = async () =>{
        const response = await axios.post(SERVER_BASE_URL+'/getCartInfo',{userId});
        console.log("response: ", response);
        switch(response.status){
            case SERVER_RESPONSE_OK:
                const cartData = JSON.parse(response.data);
                setCart(cartData);
                console.log('state cart:', cart);
                return;
            case SERVER_RESPONSE_BAD:
                alert(response.data.message);
                return;
            default:
                alert(`unexpected response code: ${response.status}`);
                return;
        }
    }
    fetchCart();

    return (
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <List className={classes.root} subheader={<li />}>
        {
        cart === null || cart === undefined ? <h1>Loading...</h1> :
        cart.baskets.map((basket) => (
            <li key={`cart-section-${basket.store}`} className={classes.listSection}>
            <ul className={classes.ul}>
                <ListSubheader>
                    <Grid container>
                        <Grid item xs={9} md={6}>
                            <ListItemText primary={`${basket.store}`}/>
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <Button variant="contained" color="primary" startIcon={<PaymentIcon/>} >
                                buy basket
                            </Button>
                        </Grid>

                    </Grid>                    
                </ListSubheader>
                {basket.products.map((product) => (
                <ListItem key={`item-${basket.store}-${product.productId}`}>
                    <Grid container>
                        <Grid item xs={9} md={6}>
                            <ListItemText primary={`name: ${product.name}`} />
                            <ListItemText primary={`prod id: ${product.id}`} />
                            <ListItemText primary={`quantity: ${product.quantity}`} />
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <Button variant="contained" color="secondary" startIcon={<DeleteIcon/>} 
                                    onClick={() => {}}>
                                remove
                            </Button>
                        </Grid>

                    </Grid>
                </ListItem>
                ))}
            </ul>
            </li>
        ))}
        </List>
        <Button variant="contained" color="primary" startIcon={<ShoppingCartIcon/>}>
            Proceed to checkout
        </Button>
        </div>
    );
}

export default Cart;