import React, { useState } from 'react'
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Banner from '.././Banner';
import Inventory from './Inventory'
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddIcon from '@material-ui/icons/Add';
import { SERVER_BASE_URL, SERVER_RESPONSE_OK, SERVER_RESPONSE_BAD } from '../../constants';
import AppointOwner from './AppointOwner'
import AppointManager from './AppointManager'
import AddProduct from './AddProduct'
import ManageCategories from './ManageCategories'
import axios from 'axios';
import { unknownStatusMessage } from '../componentUtil';
import Employees from './Employees';
import ManagePolicies from './ManagePolicies';
import BuyingPolicy from '../buying_policy/BuyingPolicy';
import DiscountPolicy from '../discount_policy/DiscountPolicy';
import DeleteManager from './RemoveManager';

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});



const getInventory = async(userId, storeId, setAppState) =>
{

}

const ADD_BUYING_POLICY = "add_buying_policy";
const ADD_DISCOUNT_POLICY = "add_discount_policy";
const DELETE_MANAGER = "delete_manager"

export default function ManageStore({getAppState, setAppState}) {
    const classes = useStyles();
    let storeId = getAppState().storeId
    const [page, setPage] = useState("");
    const [staff, setStaff] = useState(undefined);
    const [inventory, setInventory] = useState(undefined);
    const [appointOwner, setappointOwner] = useState(undefined);
    const [appointManager, setappointManager] = useState(undefined);
    const [addProduct, setaddProduct] = useState(undefined);
    const [manageCategories, setmanageCategories] = useState(undefined);
    const [policies, setPolicies] = useState(undefined);


    const onInventoryClick =() =>{
        setPage("inventory");
        if(inventory !== undefined) setInventory(undefined);
    }
    const onStaffClick = () => {
        setPage("staff");
        if(staff !== undefined)setStaff(undefined);
    }

    const onAppointOwnerClick =() =>{
        setPage("appointowner");
        if(appointOwner !== undefined) setappointOwner(undefined);

    }

    const onAppointManagerClick =() =>{
        setPage("appointmanager");
        if(appointManager !== undefined) setappointManager(undefined);

    }

    const onAddProductClick =() =>{
        setPage("addproduct");
        if(addProduct !== undefined) setaddProduct(undefined);

    }

    const onManageCategoriesClick =() =>{
        setPage("managecategories");
        if(manageCategories !== undefined) setmanageCategories(undefined);
    }

    const onPoliciesClick = () =>{
        setPage("policies");
        if(policies !== undefined) setPolicies(undefined);
    }

    const onAddPolicyClick = () =>{
        setPage(ADD_BUYING_POLICY);
    }
    const onAddDiscountClick = () =>{
        setPage(ADD_DISCOUNT_POLICY);
    }

    const onDeleteManagerClick = () =>{
        setPage(DELETE_MANAGER)
    }

    const renderPage = () =>{
        const {userId} = getAppState();
        switch(page){
            case "inventory":
                if (inventory === undefined){
                    const foo = async () =>{
                        const storeResponse = await axios.post(`${SERVER_BASE_URL}getStoreInfo`, {userId, storeId})
                        switch(storeResponse.status){
                            case SERVER_RESPONSE_OK:
                                const store = JSON.parse(storeResponse.data);
                                setAppState({inventory: store.storeProducts})
                                setInventory([]);
                                break;
                            case SERVER_RESPONSE_BAD:
                                alert(storeResponse.data);
                                break;
                            default:
                                alert(unknownStatusMessage(storeResponse));
                                break;
                        }
                    }
                    foo();
                }
                return <Inventory getAppState={getAppState} setAppState={setAppState}></Inventory>
            case "managecategories":
                if (manageCategories === undefined){
                    const foo = async () =>{
                        const storeResponse = await axios.post(`${SERVER_BASE_URL}getStoreInfo`, {userId, storeId})
                        switch(storeResponse.status){
                            case SERVER_RESPONSE_OK:
                                const store = JSON.parse(storeResponse.data);
                                setAppState({categories: store.categories})
                                setmanageCategories([]);
                                break;
                            case SERVER_RESPONSE_BAD:
                                alert(storeResponse.data);
                                break;
                            default:
                                alert(unknownStatusMessage(storeResponse));
                                break;
                        }
                    }
                    foo();
                }
                return <ManageCategories getAppState={getAppState} setAppState={setAppState}></ManageCategories>
            case "staff":
                if(staff === undefined){
                    const foo = async () =>{
                        const staffResponse = await axios.post(SERVER_BASE_URL+'/getStoreStaff', {userId, storeId});
                        switch(staffResponse.status){
                            case SERVER_RESPONSE_OK:
                                const staff = JSON.parse(staffResponse.data);
                                setAppState({staffToView: staff.subscribers})
                                setStaff([]);
                                break;
                            case SERVER_RESPONSE_BAD:
                                alert(staffResponse.data);
                                break;
                            default:
                                alert(unknownStatusMessage(staffResponse));
                                break;
                        }
                    }
                    setStaff(null)
                    foo();
                }
                return <Employees getAppState={getAppState} setAppState={setAppState} storeId={storeId}/>
            case "policies":
                const getPolicies = async () =>{
                    const policiesResponse = await axios.post(SERVER_BASE_URL+'/getBuyingPolicies', {userId, storeId});
                    switch(policiesResponse.status){
                        case SERVER_RESPONSE_OK:
                            const policies = JSON.parse(policiesResponse.data);
                            setAppState({buyingPolicies: policies})
                            break;
                        case SERVER_RESPONSE_BAD:
                            alert(policiesResponse.data);
                            break;
                        default:
                            alert(unknownStatusMessage(policiesResponse));
                            break;
                    }
                }
                getPolicies();
                return <ManagePolicies getAppState={getAppState} setAppState={setAppState}/>
            case ADD_BUYING_POLICY:
                return <BuyingPolicy getAppState={getAppState} setAppState={setAppState} isNewPolicy/>
            case ADD_DISCOUNT_POLICY:
                return <DiscountPolicy getAppState={getAppState} setAppState={setAppState} isNewPolicy/>
            case "appointowner":
                return <AppointOwner getAppState={getAppState} setAppState={setAppState}></AppointOwner>
            case "appointmanager":
                return <AppointManager getAppState={getAppState} setAppState={setAppState}></AppointManager>
            case "addproduct":
                return <AddProduct getAppState={getAppState} setAppState={setAppState}></AddProduct>
            case DELETE_MANAGER:
                return <DeleteManager getAppState={getAppState} setAppState={setAppState}></DeleteManager>
            default:
                return <h1></h1>
        }
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
            <MenuItem onClick={onStaffClick}>
                <ListItemIcon>
                    <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">View employees</Typography>
            </MenuItem>
            <MenuItem onClick={onAppointOwnerClick} >
                    <ListItemIcon>
                        <PersonAddIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Appoint new owner
                    </Typography>
                </MenuItem>
            <MenuItem onClick={onAppointManagerClick} >
                <ListItemIcon>
                    <PersonAddIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Appoint new manager
                </Typography>
            </MenuItem>
            <MenuItem onClick={onDeleteManagerClick} >
            <ListItemIcon>
                <HighlightOffIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                delete manager from store
            </Typography>
            </MenuItem>
            <MenuItem onClick={onAddProductClick}>
            <ListItemIcon>
                <AddIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                add new product
            </Typography>
            </MenuItem>
            <MenuItem onClick={onManageCategoriesClick}>
            <ListItemIcon>
                <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                manage categories
            </Typography>
            </MenuItem>
            <MenuItem onClick={onAddPolicyClick}>
                <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    add policy
                </Typography>
            </MenuItem>
            <MenuItem onClick={onAddDiscountClick}>
                <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    add discount
                </Typography>
            </MenuItem>
            {/* <MenuItem onClick={onPoliciesClick}>
                <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    manage policies
                </Typography>
            </MenuItem> */}
        </MenuList>
        </Paper>
        {renderPage(page, getAppState, setAppState, storeId)}
    </div>
  );
  }
