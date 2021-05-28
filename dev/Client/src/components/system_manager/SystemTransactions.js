import React, { useState } from 'react';
import { VIEW_SYSTEM_TRANSACTION } from '../../paths';
import AbstractTable from '../AbstractTable';
import SystemTransaction from './SystemTransaction';


const SystemTransactions = ({allTransactions}) => {
    // items: any;
    // columnNames: any;
    // renderRowCells: any;
    // rowToKey: any;
    // onRowClick: any;
    console.log('[t] all transactions:', allTransactions);
    const [transaction, setTransaction] = useState(undefined);
    const columnNames = ['Date', 'User', 'Store', 'Total'];

    const renderDate = (t) => new Date(t.time).toUTCString();
    const renderUserName = (t) => t.user;
    const renderStoreName = (t) => t.storeName;
    const renderTotal = (t) => `${t.total}$`;

    const renderRowCells = (t) => [renderDate(t), renderUserName(t), renderStoreName(t), renderTotal(t)];
    const onRowClick = (t, e) =>{
        e.stopPropagation();
        setTransaction(t);
    }
    
    var rowNumber = 0;
    const rowToKey = (t) => `${rowNumber++}`;
    console.log('[t] specific transaction:', transaction);
    return(
        transaction ?
        <SystemTransaction transaction={transaction} goBackToTable={()=>setTransaction(undefined)}/> :
        <AbstractTable
            items={allTransactions}
            columnNames={columnNames}
            renderRowCells={renderRowCells}
            onRowClick={onRowClick}
            rowToKey={rowToKey}/>
    )
}

export default SystemTransactions;