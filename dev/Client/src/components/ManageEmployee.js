import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Button } from '@material-ui/core';
import axios from 'axios';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../constants';
import { unknownStatusMessage } from './componentUtil';


const APPOINT_MANAGER     = 0;
const APPOINT_OWNER       = 1;
const INVENTORY_EDITTION  = 2;
const MANAGER_DELETION    = 3;
const VIEW_STORE_HISTORY  = 4;
const VIEW_STORE_STAFF    = 5;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));


const maskToArray =(mask) =>{
    const arr = [1,2,3,4,5,6].map(n => false);
    var bit = 1;
    for(var i=0; i<arr.length; i++){
        arr[i] = mask & bit;
        bit = bit << 1;
    }
    return arr;
}

const arrayToMask = (arr) =>{
    var output = 0;
    var bit =1;
    for(var i=0; i<arr.length; i++){
        output |= arr[i];
        bit = bit << 1;
    }
    return output;
}
export default function ManageEmployee({getAppState, setAppState, emp, storeId, onEmpUpdate}) {
  const classes = useStyles();
  const {userId} = getAppState();
  if(!emp.permissions) emp.permissions = 6;//TODO: REMOVE!
  const [mask, setMask] = React.useState(emp.permissions);

  const switchCheck = (idx) => {
    var bit = 1 << idx;
    if(isChecked(idx)){
        setMask(mask - bit);
    }else{
        setMask(mask + bit)
    }
  }

  const isChecked = (idx) =>{
      const bit = 1 << idx;
      return ((mask & bit) !== 0);
  }

  const onSaveClick = async () =>{
      const response = await axios.post(SERVER_BASE_URL+'editStaffPermission',{
        userId, storeId,
        managerToEditId: emp.id,
        permissionMask: mask
      });
      switch(response.status){
        case SERVER_RESPONSE_OK:
            console.log('[T] edit permissions response:',response.data);
            emp.permissions = mask;
            onEmpUpdate(emp);
            return;
        case SERVER_RESPONSE_BAD:
            alert(response.data);
            return;
        default:
            alert(unknownStatusMessage(response));
            return;
      }
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Assign responsibility</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={isChecked(APPOINT_MANAGER)} onChange={() => switchCheck(APPOINT_MANAGER)} name="man_apt" />}
            label="can appoint managers"
          />
          <FormControlLabel
            control={<Checkbox checked={isChecked(APPOINT_OWNER)} onChange={() => switchCheck(APPOINT_OWNER)} name="own_apt" />}
            label="can appoint owners"
          />
          <FormControlLabel
            control={<Checkbox checked={isChecked(INVENTORY_EDITTION)} onChange={() => switchCheck(INVENTORY_EDITTION)} name="inv" />}
            label="can edit inventory"
          />
        <FormControlLabel
            control={<Checkbox checked={isChecked(MANAGER_DELETION)} onChange={() => switchCheck(MANAGER_DELETION)} name="man_del" />}
            label="can delete managers"
          />
        <FormControlLabel
            control={<Checkbox checked={isChecked(VIEW_STORE_HISTORY)} onChange={() => switchCheck(VIEW_STORE_HISTORY)} name="hist" />}
            label="can view store history"
          />
        <FormControlLabel
            control={<Checkbox checked={isChecked(VIEW_STORE_STAFF)} onChange={() => switchCheck(VIEW_STORE_STAFF)} name="staff" />}
            label="can view store staff"
          />
        </FormGroup>
      </FormControl>
      <Box alignContent="center">
        <Button onClick={onSaveClick}>
            Save
        </Button>
      </Box>
    </div>
  );
}
