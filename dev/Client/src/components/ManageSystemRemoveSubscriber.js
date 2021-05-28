import { Button } from '@material-ui/core';
import React from 'react';
import AbstractTable from './AbstractTable';
import ProgressWheel from './ProgreeWheel';

const ManageSystemRemoveSubscriber = ({getAppState, setAppState}) =>{
    const {subscriberNames} = getAppState();//stores = store names list
    if(!subscriberNames)return <ProgressWheel/>;

    const onRemoveSubscriberClick = (subscriberName) =>{
        console.log(`closed store ${subscriberName}`);
    };

    const renderRemoveSubscriberButton = (subscriberName) =>{
        return (
            <Button variant="contained" color="secondary" onClick = {() => onRemoveSubscriberClick(subscriberName)}>
                Ban User
            </Button>
        );
    };

    const renderSubscriberName = (subscriberName) => subscriberName;

    const renderRowCells = (subscriberName) => [renderSubscriberName(subscriberName), renderRemoveSubscriberButton(subscriberName)];

    return(
        <AbstractTable items={subscriberNames} columnNames={['User Name', 'Manage']} renderRowCells={renderRowCells}/>
    );
}

export default ManageSystemRemoveSubscriber;