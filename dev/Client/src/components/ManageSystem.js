import React, { useState } from 'react'
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { useParams } from "react-router-dom";
import Banner from './Banner';
import Inventory from './Inventory'
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddIcon from '@material-ui/icons/Add';
import { SERVER_BASE_URL, SERVER_RESPONSE_OK, SERVER_RESPONSE_BAD } from '../constants';
import AppointOwner from './AppointOwner'
import AppointManager from './AppointManager'
import AddProduct from './AddProduct'
import ManageCategories from './ManageCategories'

import axios from 'axios';
import { unknownStatusMessage } from './componentUtil';
import Employees from './Employees';
import ManagePolicies from './ManagePolicies';
import BuyingPolicy from './buying_policy/BuyingPolicy';
import DiscountPolicy from './discount_policy/DiscountPolicy';
import SystemManageCloseStore from './SystemMangeCloseStore';
import { Grid } from '@material-ui/core';
import ManageSystemCloseStore from './ManageSystemCloseStore';

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

export default function ManageSystem({getAppState, setAppState}) {
    const classes = useStyles();
    let storeId = getAppState().storeId
    const [page, setPage] = useState("");

    const [stores, setStores] = useState(undefined);
    const [inventory, setInventory] = useState(undefined);
    const [appointOwner, setappointOwner] = useState(undefined);
    const [appointManager, setappointManager] = useState(undefined);
    const [addProduct, setaddProduct] = useState(undefined);
    const [manageCategories, setmanageCategories] = useState(undefined);
    const [policies, setPolicies] = useState(undefined);


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
        const {userId} = getAppState();
        switch(page){
            case CLOSE_STORE:
                if (stores === undefined){
                    const getStores = async () =>{
                        const storesResponse = await axios.get(`${SERVER_BASE_URL}getStoreNames`, {})
                        switch(storesResponse.status){
                            case SERVER_RESPONSE_OK:
                                const stores = JSON.parse(storesResponse.data);
                                console.log('[t] stores:', stores);
                                setAppState({stores});
                                setStores([]);
                                break;
                            case SERVER_RESPONSE_BAD:
                                alert(storesResponse.data);
                                break;
                            default:
                                alert(unknownStatusMessage(storesResponse));
                                break;
                        }
                    }
                    getStores();
                }
                return <ManageSystemCloseStore getAppState={getAppState} setAppState={setAppState}/>
            // case REMOVE_SUBSCRIBER:
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
            //     return <ManageCategories getAppState={getAppState} setAppState={setAppState}></ManageCategories>
            // case COMPLAINTS:
            //     if(staff === undefined){
            //         const foo = async () =>{
            //             const staffResponse = await axios.post(SERVER_BASE_URL+'/getStoreStaff', {userId, storeId});
            //             switch(staffResponse.status){
            //                 case SERVER_RESPONSE_OK:
            //                     const staff = JSON.parse(staffResponse.data);
            //                     setAppState({staffToView: staff.subscribers})
            //                     setStaff([]);
            //                     break;
            //                 case SERVER_RESPONSE_BAD:
            //                     alert(staffResponse.data);
            //                     break;
            //                 default:
            //                     alert(unknownStatusMessage(staffResponse));
            //                     break;
            //             }
            //         }
            //         setStaff(null)
            //         foo();
            //     }
            //     return <Employees getAppState={getAppState} setAppState={setAppState} storeId={storeId}/>
            // case TRANSACTIONS:
            //     const getPolicies = async () =>{
            //         const policiesResponse = await axios.post(SERVER_BASE_URL+'/getBuyingPolicies', {userId, storeId});
            //         switch(policiesResponse.status){
            //             case SERVER_RESPONSE_OK:
            //                 const policies = JSON.parse(policiesResponse.data);
            //                 setAppState({buyingPolicies: policies})
            //                 break;
            //             case SERVER_RESPONSE_BAD:
            //                 alert(policiesResponse.data);
            //                 break;
            //             default:
            //                 alert(unknownStatusMessage(policiesResponse));
            //                 break;
            //         }
            //     }
            //     getPolicies();
            //     return <ManagePolicies getAppState={getAppState} setAppState={setAppState}/>
            // case WTF:
            //     return <BuyingPolicy getAppState={getAppState} setAppState={setAppState} isNewPolicy/>            
            default:
                return <h1>default</h1>
        }
    }

  return (
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
  );
  }
