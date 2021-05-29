import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { VIEW_SYSTEM_TRANSACTION } from '../../paths';
import AbstractTable from '../AbstractTable';
import ProgressWheel from '../ProgreeWheel';


const SystemTransaction = ({transaction, goBackToTable}) => {
    // items: any;
    // columnNames: any;
    // renderRowCells: any;
    // rowToKey: any;
    // onRowClick: any;
    if(!transaction)return <ProgressWheel/>;
    const items = transaction.items;
    const columnNames = ['Product', 'Quantity', 'Price Per Unit', 'Total'];

    const renderProduct = (p) => p.name;
    const renderQuantity = (p) => p.quantity;
    const renderPrice = (p) => p.price;
    const renderTotal = (p) => `$${p.price*p.quantity}`;

    const renderRowCells = (p) => [renderProduct(p),renderQuantity(p),renderPrice(p),renderTotal(p)];
    
    var rowNumber = 0;
    const rowToKey = (t) => `system_transaction_${rowNumber++}`;


    return(
        <div>
            <AbstractTable
                items={items}
                columnNames={columnNames}
                renderRowCells={renderRowCells}
                rowToKey={rowToKey}/>
            <Button variant="contained" color="primary" onClick={goBackToTable}>
                Back
            </Button>
        </div>        
    )
}

export default SystemTransaction;