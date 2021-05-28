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
const WTF = "wtf";

const NOT_REQUESTED = undefined;
const REQUESTED = null;
const RECEIVED = [];

export default function ManageSystem({getAppState, setAppState}) {
    console.log('[t] ManageSystem getAppState:', getAppState);
    const classes = useStyles();
    const [page, setPage] = useState("");

    const [stores, setStores] = useState(NOT_REQUESTED);
    const [complaints, setComplaints] = useState(NOT_REQUESTED);
    const [userNames, setUserNames] = useState(NOT_REQUESTED);
    const [transactions, setTransactions] = useState(NOT_REQUESTED);



    const onCloseStoreClick =() =>{
        setPage(CLOSE_STORE);
        //if(stores !== undefined) setStores(undefined);
    }
    const onRemoveSubscriberClick = () => {
        setPage(REMOVE_SUBSCRIBER);
        //if(staff !== undefined)setStaff(undefined);
    }

    const onComplaintsClick =() =>{
        setPage(COMPLAINTS);
        //if(appointOwner !== undefined) setappointOwner(undefined);

    }

    const onTransactionsClick =() =>{
        setPage(TRANSACTIONS);
        //if(appointManager !== undefined) setappointManager(undefined);

    }

    const onWtfClick =() =>{
        setPage(WTF);
        //if(addProduct !== undefined) setaddProduct(undefined);

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
                                console.log('[t] stores:', stores);
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
            //     if (manageCategories === undefined){
            //         const foo = async () =>{
            //             const storeResponse = await axios.post(`${SERVER_BASE_URL}getStoreInfo`, {userId, storeId})
            //             switch(storeResponse.status){
            //                 case SERVER_RESPONSE_OK:
            //                     const store = JSON.parse(storeResponse.data);
            //                     setAppState({categories: store.categories})
            //                     setmanageCategories([]);
            //                     break;
            //                 case SERVER_RESPONSE_BAD:
            //                     alert(storeResponse.data);
            //                     break;
            //                 default:
            //                     alert(unknownStatusMessage(storeResponse));
            //                     break;
            //             }
            //         }
            //         foo();
            //     }
                if(userNames === NOT_REQUESTED){
                    setUserNames(ph_subscribers);
                }
                return <ManageSubscribers getAppState={getAppState} subscriberNames={userNames}/>
            case COMPLAINTS:
                // if(complaints === undefined){
                //     const loadComplaints = async () =>{
                //         const complaintsResponse = await axios.post(SERVER_BASE_URL+'/getSystemComplaints', {userId});
                //         switch(staffResponse.status){
                //             case SERVER_RESPONSE_OK:
                //                 const complaints = JSON.parse(complaintsResponse.data);
                //                 setAppState({complaints})
                //                 setComplaints([]);
                //                 break;
                //             case SERVER_RESPONSE_BAD:
                //                 alert(staffResponse.data);
                //                 setComplaints(NOT_REQUESTED);
                //                 break;
                //             default:
                //                 alert(unknownStatusMessage(staffResponse));
                //                 setComplaints(NOT_REQUESTED);
                //                 break;
                //         }
                //     }
                //     loadComplaints();
                //     setComplaints(null)
                // }
                if(complaints === NOT_REQUESTED){
                    setAppState({complaints: ph_complaints});
                    setComplaints(RECEIVED);
                }
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
                return <SystemTransactions allTransactions={transactions}/>
            // case WTF:
            //     return <BuyingPolicy getAppState={getAppState} setAppState={setAppState} isNewPolicy/>            
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
                <MenuItem onClick={onWtfClick}>
                    <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
                    <Typography variant="inherit" noWrap>WTF</Typography>
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
