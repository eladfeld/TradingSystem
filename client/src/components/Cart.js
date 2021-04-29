import {List, ListSubheader, ListItemText, ListItem, Grid, Button, Container } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {removeFromCart} from '../actions/guest';


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


const Cart = (props) => {
    const classes = useStyles();
    return (
        <div>
        <List className={classes.root} subheader={<li />}>
        {props.cart.map((basket) => (
            <li key={`cart-section-${basket.storeId}`} className={classes.listSection}>
            <ul className={classes.ul}>
                <ListSubheader>
                    <Grid container>
                        <Grid item xs={9} md={6}>
                            <ListItemText primary={`${basket.storeName}`}/>
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <Button variant="contained" color="primary" startIcon={<PaymentIcon/>} >
                                buy basket
                            </Button>
                        </Grid>

                    </Grid>                    
                </ListSubheader>
                {basket.products.map((product) => (
                <ListItem key={`item-${basket.storeId}-${product.productId}`}>
                    <Grid container>
                        <Grid item xs={9} md={6}>
                            <ListItemText primary={`name: ${product.productName}`} />
                            <ListItemText primary={`prod id: ${product.productId}`} />
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <Button variant="contained" color="secondary" startIcon={<DeleteIcon/>} 
                                    onClick={() => props.removeFromCart(basket.storeId,product.productId,1,'')}>
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

const mapStateToProps = (state) =>{
    return {cart: state.cart};
};
export default connect(mapStateToProps,{removeFromCart})(Cart);