import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import history from '../../history';
import ProgressWheel from '../ProgreeWheel';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Switch from "react-switch";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { List, Button, ButtonGroup, Container, Paper, Typography, Link, TextField } from '@material-ui/core';
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



const Offers = ({getAppState, setAppState, setPage}) => {
    const classes = useStyles();
    const [offers, setOffers] = useState(undefined);
    const [state, setState] = useState(false);
    const { storeId } = getAppState();

    useEffect(() => {
      async function fetchData() {
        // Call fetch as usual
        const res = await axios.post(`${SERVER_BASE_URL}isRecievingOffers`, { storeId})

        // Save the posts into state
        // (look at the Network tab to see why the path is like this)
        setState(res.data);
      }

      fetchData();
    });

    const getOffers = () =>{
      axios.post(SERVER_BASE_URL+'/getOffersByStore', {storeId}).then((offersResponse) =>
      {
          switch(offersResponse.status){
              case SERVER_RESPONSE_OK:
                setOffers( offersResponse.data);
                  break;
              case SERVER_RESPONSE_BAD:
                  alert("ho no")
                  break;
                  default:
                  alert("ho no")
                  break;
          }
      })
  }
  if(offers === undefined)getOffers();
    const renderOffer = (offer, setAppState) =>
    {
      return(
        <li className={classes.root} subheader={<li />}>

          <Button startIcon={<LocalOfferIcon/>} variant="contained" color="primary"  onClick={() => {
            setAppState({offer: offer});
            setPage("offer")
          }}>
            <text>{`user: ${offer.username}\n offer for product: ${offer.productName} state: ${offer.offerStatus}`}</text>
          </Button>
          </li>

      )

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
            alignItems={'center'}
            control={
              <Switch onChange={handleChange} checked={state}/>
            }
            label="turn on offers to this store"
          />
        <List>
          {
          offers === [] || offers === null || offers === undefined ? <h1>no offers to show</h1> :
          offers.map(offer => renderOffer(offer, setAppState))
          }
        </List>

        </Paper>

        </div>
    );
}

export default Offers;
