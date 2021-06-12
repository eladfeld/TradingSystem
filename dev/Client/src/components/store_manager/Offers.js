import {List, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import history from '../../history';
import ProgressWheel from '../ProgreeWheel';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';


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

const renderOffer = (offer, setAppState) =>
{
  return(
      <Button startIcon={<LocalOfferIcon/>} variant="contained" color="secondary" onClick={() => {
        setAppState({offer: offer});
        // history.push(`/store/${store.storeId}`)
      }}>
        {`offer for user: ${offer.username}`}
      </Button>
  )
}

const Offers = ({getAppState, setAppState}) => {
    const classes = useStyles();
    const {offers} = getAppState();
    return (
        <div >
        <List className={classes.root} subheader={<li />}>
        {
        offers === null || offers === undefined ? <h1>no offers to show</h1> :
        offers.map(offer => renderOffer(offer, setAppState))
        }
        </List>
        </div>
    );
}

export default Offers;