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
import { SERVER_BASE_URL } from '../constants';

import axios from 'axios';

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});

const getInventory = async(userId, storeId, setAppState) =>
{
    const storeInfo = await axios.post(`${SERVER_BASE_URL}getStoreInfo`, {userId, storeId})
    const store = JSON.parse(storeInfo.data);
    setAppState({storeInventory: store.storeProducts})
}
const renderPage = async(page, getAppState, setAppState, storeId) =>{
    switch(page){
        case "inventory":
            const inventory = await getInventory(getAppState().userId, storeId, setAppState);
            return <Inventory getAppState={getAppState} setAppState={setAppState} inventory={inventory}></Inventory>
        case "shit":
            return <h1>shit</h1>
        default:
            return <h1>default</h1>
    }
}

export default function TypographyMenu({getAppState, setAppState}) {
  const classes = useStyles();
  let storeId = getAppState().storeId
    const [page, setPage] = useState("");

    const onInventoryClick =() =>{
        setPage("inventory");
    }
  return (
    <div>
      <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Paper className={classes.root}>
        <MenuList>
            <MenuItem onClick={onInventoryClick} >
                <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Inventory</Typography>
            </MenuItem>
            <MenuItem>
            <ListItemIcon>
                <PeopleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">View employees</Typography>
            </MenuItem>
            <MenuItem>
            <ListItemIcon>
                <PersonAddIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                Appoint new owner
            </Typography>
            </MenuItem>
            <MenuItem>
            <ListItemIcon>
                <PersonAddIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                Appoint new manager
            </Typography>
            </MenuItem>
        </MenuList>
        </Paper>
        {renderPage(page, getAppState, setAppState, storeId)} 
    </div>
  );
}