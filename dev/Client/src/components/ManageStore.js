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
import AppointManager from './AppointManager'
import AppointOwner from './AppointOwner'
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';

import axios from 'axios';
import { unknownStatusMessage } from './componentUtil';
import ProgressWheel from './ProgreeWheel';
import Employees from './Employees';

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});

const getInventory = async (userId, storeId) =>
{
    console.log(storeId);
    const storeInfo = await axios.post(`${SERVER_BASE_URL}getStoreInfo`, {userId, storeId});
    console.log(storeInfo.inventory);
    return storeInfo.inventory;
}
// const renderPage = (page, getAppState, setAppState, storeId) =>{
//     switch(page){
//         case "inventory":
//             const inventory = getInventory(getAppState().userId, Number(storeId));
//             return <Inventory getAppState={getAppState} setAppState={setAppState} inventory={inventory}></Inventory>
//         case "shit":
//             return <h1>shit------------------------------------------------------------------------------------------------ </h1>
//         case "appointowner":
//             return <AppointOwner getAppState={getAppState} setAppState={setAppState}></AppointOwner>
//         case "appointmanager":
//             return <AppointManager getAppState={getAppState} setAppState={setAppState}></AppointManager>
//         default:
//             return <h1>default ------------------------------------------------------------------------------------------------</h1>
//     }
// }

export default function TypographyMenu({getAppState, setAppState}) {
    const classes = useStyles();
    let storeId = getAppState().storeId
    const [page, setPage] = useState("");
    const [staff, setStaff] = useState(undefined);

    const onInventoryClick =() =>{setPage("inventory");}
    const onStaffClick = () => {
        setPage("staff");
        if(staff !== undefined)setStaff(undefined);
    }


    const renderPage = () =>{
        const {userId} = getAppState();
        switch(page){
            case "inventory":
                return <h1>Inventory</h1>
                const inventory = getInventory(getAppState().userId, Number(storeId));
                //return <Inventory getAppState={getAppState} setAppState={setAppState} inventory={inventory}></Inventory>
            case "staff":
                //return <h1>Staff</h1>;
                if(staff === undefined){
                    const foo = async () =>{
                        const staffResponse = await axios.post(SERVER_BASE_URL+'/getStoreStaff', {userId, storeId});
                        console.log('[T] staff response data', staffResponse.data);
                        switch(staffResponse.status){
                            case SERVER_RESPONSE_OK:
                                const staff = JSON.parse(staffResponse.data);
                                setStaff(staff);
                            case SERVER_RESPONSE_BAD:
                                alert(staffResponse.data);
                                break;
                            default:
                                alert(unknownStatusMessage(staffResponse));
                                break;
                        }
                    }
                    foo();
                    setStaff(null)
                }
                return <Employees getAppState={getAppState} setAppState={setAppState} staff={staff}/>
            case "appointowner":
                return <AppointOwner getAppState={getAppState} setAppState={setAppState}></AppointOwner>
            case "appointmanager":
                return <AppointManager getAppState={getAppState} setAppState={setAppState}></AppointManager>
            default:
                return <h1>default</h1>
        }
    }

    const onAppointOwnerClick =() =>{
        setPage("appointowner");
    }

    const onAppointManagerClick =() =>{
        setPage("appointmanager");
    }

  alert(`storeId: ${Number(storeId)}`)
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
            <MenuItem onClick={onStaffClick}>
                <ListItemIcon>
                    <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">View employees</Typography>
            </MenuItem>
            <MenuItem>
                <MenuItem onClick={onAppointOwnerClick} >
                    <ListItemIcon>
                        <PersonAddIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Appoint new owner
                    </Typography>
                </MenuItem>

            </MenuItem>
            <MenuItem>
                <MenuItem onClick={onAppointManagerClick} >
                    <ListItemIcon>
                        <PersonAddIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Appoint new manager
                    </Typography>
                </MenuItem>
            </MenuItem>
        </MenuList>
        </Paper>

        {renderPage() }



    </div>
  );
}