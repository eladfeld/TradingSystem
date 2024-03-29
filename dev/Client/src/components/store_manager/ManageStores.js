import {List, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Banner from '../Banner';
import history from '../../history';
import ProgressWheel from '../ProgreeWheel';
import StoreIcon from '@material-ui/icons/Store';

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

const renderStore = (store, setAppState) =>
{
  return(
      <Button startIcon={<StoreIcon/>} variant="contained" color="secondary" onClick={() => {
        setAppState({storeId: store.storeId})
        history.push(`/store/${store.storeId}`)
      }}>
        {store.storeName}
      </Button>
  )
}
//TODO: FIX the multiple fetchCart requests issue
const ManageStores = ({getAppState, setAppState}) => {
    const classes = useStyles();
    const {stores} = getAppState();
    return (
        <div >
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <List className={classes.root} subheader={<li />}>
        {
        stores === null || stores === undefined ? <ProgressWheel/> :
        stores.map(store => renderStore(store, setAppState))
        }
        </List>
        </div>
    );
}

export default ManageStores;