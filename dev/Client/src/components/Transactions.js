import Banner from "./Banner"


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

export default function Transactions({getAppState, setAppState}) {
  const classes = useStyles();
  const {myTransactions} = getAppState();

  const renderTransaction = (t) =>{
      return (
        <ListItem key={`item-${t.transactionId}`}>
            <ListItemText primary={`${t.storeId}-${t.time}-${t.total}`} />
        </ListItem>
      );
  };


  return (
      myTransactions===undefined || myTransactions===null ? <div><h1>Loading...</h1></div> :
      <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <h1>Your Transactions</h1>
        <List className={classes.root} subheader={<li />}>
            {myTransactions.map((transaction) => renderTransaction(transaction))}
        </List>
    </div>
  );
}


