import {List, ListSubheader, ListItemText, Grid, Button } from '@material-ui/core';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../constants';
import Banner from './Banner';
import history from '../history';
import ProgressWheel from './ProgreeWheel';
import CartItem from './CartItem';

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

const renderStore = (store) =>
{
  return(
      <Button onClick={() => {
        //history.push(`/store/:${store.storeId}`)
        alert(`yay you enter ${store.storeName}`);
      }}>
        {store.storeName}
      </Button>
  )
}
//TODO: FIX the multiple fetchCart requests issue
const ManageStores = ({getAppState, setAppState}) => {
    const classes = useStyles();
    const {stores} = getAppState();


    console.log(stores)
    return (
        <div >
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <List className={classes.root} subheader={<li />}>
        {
        stores === null || stores === undefined ? <ProgressWheel/> :
        stores.map(store => renderStore(store))
        }
        </List>
        </div>
    );
}

export default ManageStores;