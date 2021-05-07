import React, { useState } from 'react';
import {ListItemText, ListItem, Grid, Button,  TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../constants';



const CartItem = ({getAppState, setAppState, basket, product}) =>{
    const {userId, cart} = getAppState();
    const [quantity, setQuantity] = useState(product.quantity);

    const onUpdateQuantityClick = async () =>{
        const response = await axios.post(SERVER_BASE_URL+'editCart',{
            userId,
            storeId: basket.storeId,
            productId: product.productId,
            quantity
        });
        console.log(`update quantity click:`, response);
        switch(response.status){
            case SERVER_RESPONSE_OK:
                cart.baskets.find(b => b.storeId === basket.storeId).products.find(p => p.productId === product.productId).quantity = quantity;
                setAppState({cart});
                return;
            case SERVER_RESPONSE_BAD:
                alert(response.data);
                setQuantity(product.quantity);
                return;
            default:
                alert(`unknown response code ${response.status}`);
                return;
        }    
    }

    return (
        <ListItem key={`item-${basket.store}-${product.productId}`}>
        <Grid container>
            <Grid item xs={9} md={6}>
                <ListItemText size="large" primary={`${product.name}`} />
                <ListItemText primary={`Serial No.: ${product.productId}`} />
            </Grid>
            <Grid item xs={3} md={2}>
            <TextField
                type="number"
                id="outlined-size-small"
                // defaultValue={quantity}
                onChange = {(e) => setQuantity(e.target.value)}
                variant="outlined"
                size="small"
                color="secondary"
                value = {quantity}
            />
            <Button variant="contained" color="primary" startIcon={<DeleteIcon/>} 
                    onClick={onUpdateQuantityClick}>
                Update
            </Button>
            </Grid>
        </Grid>
    </ListItem>
    );
}

export default CartItem;