import { Button } from '@material-ui/core';
import React from 'react';
import AbstractTable from '../AbstractTable';
import ProgressWheel from '../ProgreeWheel';

const ManageSubscribers = ({getAppState, subscriberNames, setSubscriberNames}) =>{
    const {userId} = getAppState();//stores = store names list
    if(!subscriberNames)return <ProgressWheel/>;

    const onRemoveSubscriberClick = async(subscriberName) =>{
        console.log(`banned user ${subscriberName}`);
        // const banUserResponse = await axios.get(`${SERVER_BASE_URL}banUser`, {userId, subscriberName})
        // switch(banUserResponse.status){
        //     case SERVER_RESPONSE_OK:
        //         //const stores = JSON.parse(closeStoreResponse.data);
        //         setSubscriberNames(subscriberNames.filter(s => s !== subscriberName));
        //         break;
        //     case SERVER_RESPONSE_BAD:
        //         alert(banUserResponse.data);
        //         break;
        //     default:
        //         alert(unknownStatusMessage(banUserResponse));
        //         break;
        // }
        setSubscriberNames(subscriberNames.filter(s => s !== subscriberName));
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
        <AbstractTable
            items={subscriberNames} 
            columnNames={['User Name', 'Manage']} 
            renderRowCells={renderRowCells}
            />
    );
}

export default ManageSubscribers;