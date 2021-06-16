import {List, ListSubheader, ListItemText, Grid, Button } from '@material-ui/core';
import PaymentIcon from '@material-ui/icons/Payment';
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../constants';
import Banner from './Banner';
import history from '../history';
import ProgressWheel from './ProgreeWheel';
import CounterOffer from './CounterOffer';
import CartItem from './CartItem';
import Alert from '@material-ui/lab/Alert';
import BorderColorIcon from '@material-ui/icons/BorderColor';
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
const ActiveOffers = ({getAppState, setAppState}) => {
    const classes = useStyles();
    const [activeOffers, setActiveOffers] = useState(undefined);
    const [problem, setProblem] = useState("");
    const {userId} = getAppState();
    const [page, setPage] = useState("offers")
    const [offer, setOffer] = useState(undefined)


    const COUNTER = "counter"
    const OFFERS = "offers"
    const executeOffer = async (storeId, offerId) => {
        const response = await axios.post(SERVER_BASE_URL+'buyAcceptedOffer',{userId, storeId, offerId});
        switch(response.status){
            case SERVER_RESPONSE_OK:
                setAppState({basketAtCheckout:storeId});
                history.push('/checkout');
                return;
            case SERVER_RESPONSE_BAD:
                setProblem(response.data);
                return;
            default:
                setProblem(`unexpected response code: ${response.status}`);
                return;
        }
    }


    const fetchActiveOffers = async () => {
        const response = await axios.post(SERVER_BASE_URL+'/getOffersByUser', {userId});
        switch(response.status){
            case SERVER_RESPONSE_OK:
                console.log(response.data)
                setActiveOffers(response.data)
                return;
            case SERVER_RESPONSE_BAD:
                setProblem(response.data);
                return;
            default:
                setProblem(`unexpected response code: ${response.status}`);
                return;
        }
    }

    if(activeOffers === undefined)
        fetchActiveOffers();
    switch(page)
    {
        case OFFERS:
            return (
                <div >
                <Banner getAppState={getAppState} setAppState={setAppState}/>
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
                <a1>Active offers</a1>
                <br/>
                <br/>
                <br/>
                <List className={classes.root} subheader={<li />}>
                {
                activeOffers === null || activeOffers === undefined ? <ProgressWheel/> :
                activeOffers.map((offer) => (
                    <li key={`offers-section-${offer.offerId}`} className={classes.listSection}>
                    <ul className={classes.ul}>
                        <ListSubheader>
                            <Grid container>
                                <Grid item xs={9} md={6}>
                                    <ListItemText primary={`offer for ${offer.productName} with bid of ${offer.bid}`}/>
                                </Grid>
                                <Grid item xs={3} md={2}>
                                    {offer.offerStatus === "PENDING" ?
                                        <Button variant="contained" color="primary"  onClick={() => setProblem("this offer is still pending")} >
                                            pending
                                        </Button>:
                                        offer.offerStatus === "DECLINED" ?
                                        <Button variant="contained" color="secondary"  onClick={() => setProblem("this offer is declined, make a better one ;)")} >
                                            declined
                                        </Button>:
                                        offer.offerStatus === "ACCEPTED AND SOLD OUT" ?
                                        <Button variant="contained" color="primary"  onClick={() => setProblem("this offer already got executed, make another one")} >
                                            offer accpted and bought
                                        </Button> :
                                        offer.offerStatus === "COUNTER" ?
                                        <Button variant="contained" color="primary" startIcon={<BorderColorIcon/>} onClick={() => {
                                            setOffer(offer)
                                            setPage(COUNTER)
                                            }} >
                                            watch counter offer
                                        </Button>:
                                        offer.offerStatus === "PURCHASED" ?
                                        <Button variant="contained" color="primary" onClick={() => setProblem("this offer was already purchased")} >
                                            purchased
                                        </Button>:
                                        <Button variant="contained" color="primary" startIcon={<PaymentIcon/>} onClick={() => executeOffer(offer.storeId, offer.offerId)} >
                                        execute offer
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </ListSubheader>
                    </ul>
                    </li>
                ))}
                </List>
                </div>
            );
        case COUNTER:
            return <CounterOffer getAppState={getAppState} setAppState={setAppState} offer={offer} setPage={setPage}/>
    }

}

export default ActiveOffers;