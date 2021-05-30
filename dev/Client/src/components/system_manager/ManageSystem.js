import React, { useState } from 'react'
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import { Grid } from '@material-ui/core';


import { SERVER_BASE_URL, SERVER_RESPONSE_OK, SERVER_RESPONSE_BAD } from '../../constants';
import { unknownStatusMessage } from '../componentUtil';
import { ph_complaints, ph_subscribers, ph_system_transactions } from '../../PlaceHolders';
import ManageSystemCloseStore from './ManageSystemCloseStore';
import ViewComplaints from './ViewComplaints';
import SystemTransactions from './SystemTransactions';
import ManageSubscribers from './ManageSubscribers';
import Banner from '../Banner';

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});

const CLOSE_STORE = "close_store";
const REMOVE_SUBSCRIBER = "remove_subscriber";
const COMPLAINTS = "complaints";
const TRANSACTIONS = "transactions";

const NOT_REQUESTED = undefined;
const REQUESTED = null;
const RECEIVED = [];

export default function ManageSystem({getAppState, setAppState}) {
    const classes = useStyles();
    const [page, setPage] = useState("");

    const [stores, setStores] = useState(NOT_REQUESTED);
    const [userNames, setUserNames] = useState(NOT_REQUESTED);
    const [complaints, setComplaints] = useState(NOT_REQUESTED);
    const [transactions, setTransactions] = useState(NOT_REQUESTED);

    const {userId} = getAppState();



    const onCloseStoreClick =async() =>{
        setStores(NOT_REQUESTED);
        setPage(CLOSE_STORE);
    }
    const onRemoveSubscriberClick =async () => {
        setUserNames(NOT_REQUESTED);
        setPage(REMOVE_SUBSCRIBER);
    }

    const onComplaintsClick =async() =>{
        setComplaints(NOT_REQUESTED);
        setPage(COMPLAINTS);
    }

    const onTransactionsClick =async() =>{
        setTransactions(NOT_REQUESTED);
        setPage(TRANSACTIONS);
    }



    const renderPage = () =>{
        switch(page){
            case CLOSE_STORE:
                if (stores === NOT_REQUESTED){
                    const getStores = async () =>{
                        const storesResponse = await axios.get(`${SERVER_BASE_URL}getStoreNames`, {})
                        switch(storesResponse.status){
                            case SERVER_RESPONSE_OK:
                                const stores = JSON.parse(storesResponse.data);
                                setAppState({stores});
                                setStores(RECEIVED);
                                break;
                            case SERVER_RESPONSE_BAD:
                                alert(storesResponse.data);
                                setStores(NOT_REQUESTED);
                                break;
                            default:
                                alert(unknownStatusMessage(storesResponse));
                                setStores(NOT_REQUESTED);
                                break;
                        }
                    }
                    setStores(REQUESTED);
                    getStores();
                }
                return <ManageSystemCloseStore getAppState={getAppState} setAppState={setAppState}/>
            case REMOVE_SUBSCRIBER:
                // if (userNames === NOT_REQUESTED){
                //     const loadUserNames = async () =>{
                //         const userNamesResponse = await axios.post(`${SERVER_BASE_URL}getUsersNames`, {userId})
                //         switch(userNamesResponse.status){
                //             case SERVER_RESPONSE_OK:
                //                 setUserNames(JSON.parse(userNamesResponse.data));
                //                 break;
                //             case SERVER_RESPONSE_BAD:
                //                 alert(userNamesResponse.data);
                //                 break;
                //             default:
                //                 alert(unknownStatusMessage(userNamesResponse));
                //                 break;
                //         }
                //     }
                //     loadUserNames();
                // }
                if(userNames === NOT_REQUESTED){
                    setUserNames(ph_subscribers);
                }
                return <ManageSubscribers getAppState={getAppState} subscriberNames={userNames} setSubscriberNames={setUserNames}/>
            case COMPLAINTS:
                if(complaints === NOT_REQUESTED){
                    const loadComplaints = async () =>{
                        const complaintsResponse = await axios.post(SERVER_BASE_URL+'/getSystemComplaints', {userId});
                        switch(complaintsResponse.status){
                            case SERVER_RESPONSE_OK:
                                var allComplaints = complaintsResponse.data;// JSON.parse(complaintsResponse.data);
                                allComplaints = allComplaints.map(chat => chat[0]);//
                                console.log('[t] all complaints', allComplaints);
                                setAppState({complaints:allComplaints})
                                setComplaints(RECEIVED);
                                break;
                            case SERVER_RESPONSE_BAD:
                                alert(complaintsResponse.data);
                                setComplaints(NOT_REQUESTED);
                                break;
                            default:
                                alert(unknownStatusMessage(complaintsResponse));
                                setComplaints(NOT_REQUESTED);
                                break;
                        }
                    }
                    loadComplaints();
                    setComplaints(null)
                }
                // if(complaints === NOT_REQUESTED){
                //     setAppState({complaints: ph_complaints});
                //     setComplaints(RECEIVED);
                // }
                return <ViewComplaints getAppState={getAppState} setAppState={setAppState}/>
            case TRANSACTIONS:
                // if(transactions === undefined){
                //     const loadTransactions = async () =>{
                //         const transactionsResponse = await axios.post(SERVER_BASE_URL+'/getSystemTransactions', {userId});
                //         switch(transactionsResponse.status){
                //             case SERVER_RESPONSE_OK:
                //                 setAppState({complaints:JSON.parse(complaintsResponse.data)})
                //                 setComplaints([]);
                //                 break;
                //             case SERVER_RESPONSE_BAD:
                //                 alert(transactionsResponse.data);
                //                 break;
                //             default:
                //                 alert(unknownStatusMessage(transactionsResponse));
                //                 break;
                //         }
                //     }
                //     loadTransactions();
                //     setTransactions(null)
                // }
                if(transactions === NOT_REQUESTED){
                    setAppState({systemTransactions: ph_system_transactions});
                    setTransactions(ph_system_transactions);
                }
                return <SystemTransactions userId={userId}/>         
            default:
                return <div></div>;
        }
    }

  return (
      <div>
          <Banner getAppState={getAppState} setAppState={setAppState}/>
    <Grid container>
        <Grid item xs={1}>
            <Paper className={classes.root}>
            <MenuList>
                <MenuItem onClick={onCloseStoreClick} >
                    <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                    <Typography variant="inherit">Close Store</Typography>
                </MenuItem>
                <MenuItem onClick={onRemoveSubscriberClick}>
                    <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
                    <Typography variant="inherit">Remove Subscriber</Typography>
                </MenuItem>
                <MenuItem onClick={onComplaintsClick} >
                    <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
                    <Typography variant="inherit" noWrap>Complaints</Typography>
                </MenuItem>
                <MenuItem onClick={onTransactionsClick} >
                    <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
                    <Typography variant="inherit" noWrap>Transactions</Typography>
                </MenuItem>
            </MenuList>
            </Paper>
        </Grid>
        <Grid item xs={11}>
            {renderPage(page, getAppState, setAppState)}
        </Grid>
    </Grid>
    </div>
  );
  }
