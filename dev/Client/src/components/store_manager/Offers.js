import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import history from '../../history';
import ProgressWheel from '../ProgreeWheel';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Switch from "react-switch";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, ButtonGroup, Container, Paper, Typography, Link } from '@material-ui/core';
import { SERVER_BASE_URL, SERVER_RESPONSE_OK, SERVER_RESPONSE_BAD } from '../../constants';
import axios from 'axios';

const paperStyle={padding :20,height:'70vh',width:500, margin:"20px auto"}

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
    const [state, setState] = useState(undefined);
    const { storeId } = getAppState();

    if(state === undefined) {
      axios.post(`${SERVER_BASE_URL}isRecievingOffers`, { storeId})
      .then(ans => setState(ans))
      .catch(error => console.log(error));
    }

    const handleChange = async (event) =>
    {
      axios.post(`${SERVER_BASE_URL}setRecievingOffers`, {state:event, storeId})
      if(state)
      {
        await setState(false);
      }
      else
        await setState(true);
    }
    return (
        <div >
        <Paper elevation={10} style={paperStyle}>

        <FormControlLabel
          control={
            <Switch onChange={handleChange} checked={state}/>
          }
          label="turn on offers to this store"
        />
        <ul className={classes.root} subheader={<li />}>
        {
        offers === null || offers === undefined ? <h1>no offers to show</h1> :
        offers.map(offer => renderOffer(offer, setAppState))
        }
        </ul>
        </Paper>

        </div>
    );
}

export default Offers;
