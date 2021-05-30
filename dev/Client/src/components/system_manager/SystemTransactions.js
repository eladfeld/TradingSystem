import { Grid, Paper } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../../constants';
import AbstractTable from '../AbstractTable';
import SystemTransaction from './SystemTransaction';
import UserStoreSearch from './UserStoreSearch';


const SystemTransactions = ({userId}) => {
    // items: any;// columnNames: any;// renderRowCells: any;// rowToKey: any;// onRowClick: any;

    const [transaction, setTransaction] = useState(undefined);
    const [transactions, setTransactions] = useState([]);

    const onSearchClick = (response) => {
        switch(response.status){
            case SERVER_RESPONSE_OK:
              var t = response.data;
              if(typeof t === 'string'){
                console.log('[t] was:',{t:t});
                t = JSON.parse(t);
                console.log('[t] is:',{t:t});
              }
              setTransaction(undefined);
              setTransactions(t);
              return;
            case SERVER_RESPONSE_BAD:
              alert(response.data.message);
              return;
            default:
              alert(response.data.message);
              return;
        }
    }

    //search props
    const onSearchUserClick = async(text) =>{
        const response = await axios.post(SERVER_BASE_URL+'getSubscriberPurchaseHistory',{userId, subscriberToSeeId:Number(text)});
        console.log('[t] user transactions data:', response.data)
        onSearchClick(response);
    }
    const onSearchStoreClick= async(text) =>{
        const response = await axios.post(SERVER_BASE_URL+'getStorePurchaseHistory',{userId,storeId:Number(text)});
        onSearchClick(response);
    }

    //table props
    //[{"transcationId":1,"userId":13,"storeId":0,"total":500
    //"cardNumber":123,"status":3,"time":1622317785411,"shipmentId":61207,"storeName":"Walmart",
    //"items":[{"productId":166,"name":"Combos","price":10,"Quantity":50}]}]
    const columnNames = ['Date', 'User', 'Store', 'Total'];
    const renderDate = (t) => new Date(t.time).toUTCString();
    const renderUserName = (t) => t.userId;
    const renderStoreName = (t) => t.storeName;
    const renderTotal = (t) => `$${t.total}`;
    const renderRowCells = (t) => [renderDate(t), renderUserName(t), renderStoreName(t), renderTotal(t)];
    const onRowClick = (t, e) =>{
        e.stopPropagation();
        setTransaction(t);
    }
    
    var rowNumber = 0;
    const rowToKey = (t) => `${rowNumber++}`;
    const paperStyle={padding :20,height:"auto",width:"50vw", margin:"20px auto"}

    return(
        <Paper style={paperStyle}>
            <UserStoreSearch onSearchUserClick={onSearchUserClick} onSearchStoreClick={onSearchStoreClick}/>
            {
                transaction ?
                    <SystemTransaction transaction={transaction} goBackToTable={()=>setTransaction(undefined)}/> :
                    <AbstractTable
                        items={transactions}
                        columnNames={columnNames}
                        renderRowCells={renderRowCells}
                        onRowClick={onRowClick}
                        rowToKey={rowToKey}
                        xs={12} md={12}/>
            }
        </Paper>

    )
}

export default SystemTransactions;