import { Button, Typography } from '@material-ui/core';
import React from 'react';
import AbstractTable from '../AbstractTable';
import ProgressWheel from '../ProgreeWheel';

const ManageSystemCloseStore = ({getAppState, setAppState}) =>{
    const {stores, userId} = getAppState();//stores = store names list
    if(!stores)return <ProgressWheel/>;

    const onCloseStoreClick = async (storeName) =>{
        // const closeStoreResponse = await axios.post(`${SERVER_BASE_URL}closeStore`, {userId, storeName})
        // switch(closeStoreResponse.status){
        //     case SERVER_RESPONSE_OK:
        //         //const stores = JSON.parse(closeStoreResponse.data);
        //         setAppState({stores: stores.filter(s => s !== storeName)});
        //         break;
        //     case SERVER_RESPONSE_BAD:
        //         alert(closeStoreResponse.data);
        //         break;
        //     default:
        //         alert(unknownStatusMessage(closeStoreResponse));
        //         break;
        // }
        setAppState({stores: stores.filter(s => s !== storeName)});

    };

    const renderCloseStoreButton = (storeName) =>{
        return (
            <Button variant="contained" color="secondary" onClick = {() => onCloseStoreClick(storeName)}>
                <Typography variant="inherit">{`Close ${storeName}`}</Typography>
            </Button>
        );
    };

    const renderStoreName = (storeName) => <Typography variant="inherit">{`${storeName}`}</Typography>

    const renderRowCells = (store) => [renderStoreName(store), renderCloseStoreButton(store)];

    return(
        <AbstractTable items={stores} columnNames={['Store Name', 'Manage']} renderRowCells={renderRowCells}/>
    );
}

export default ManageSystemCloseStore;