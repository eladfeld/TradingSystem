import { Button, Typography } from '@material-ui/core';
import React from 'react';
import AbstractTable from './AbstractTable';
import ProgressWheel from './ProgreeWheel';

const ManageSystemCloseStore = ({getAppState, setAppState}) =>{
    const {stores} = getAppState();//stores = store names list
    if(!stores)return <ProgressWheel/>;

    const onCloseStoreClick = (storeName) =>{
        console.log(`closed store ${storeName}`);
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