import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import history from '../history';
import Banner from './Banner';
import { Button, Grid } from '@material-ui/core';
import ProgressWheel from './ProgreeWheel';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
});

export default function SystemManageCloseStore({getAppState, setAppState}) {
  const classes = useStyles();
  const {stores} = getAppState();

  if(!stores)return <ProgressWheel/>;
  const onStoreClick = (s) =>{
    //stopPropagation(e);
    //setAppState({myTansactionToView: t});
    alert(`${s} is shut the fuck down!!!`)
    //history.push('/viewmytransaction');
  }

  return (
    
    <div>
      <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid container>
          <Grid item xs={0} md={3}/>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Store Name</StyledTableCell>
                    <StyledTableCell align="left">Manage</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stores.map((s) => (
                    <StyledTableRow key={`${s}`} onClick={(e) => onStoreClick(s)}>
                      <StyledTableCell component="th" scope="row">{`${s}`}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Button variant="contained" color="secondary">Close</Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Grid>
          <Grid item xs={0} md={3}/>
      </Grid>
    </div>

  );
}
