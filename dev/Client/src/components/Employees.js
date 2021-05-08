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
import { Grid } from '@material-ui/core';
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

export default function Employees({getAppState, setAppState, staff}) {
  const classes = useStyles();
  //const {myTransactions} = getAppState();
    if(staff === null || staff === undefined){
        return <ProgressWheel/>;
    }
  return (    
    <div>
      <Grid container>
        <Grid item xs={0} md={3}/>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Id</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">Rating</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[0,1,2,3].map((t) => (
                  <StyledTableRow key={t.transactionId}>
                    <StyledTableCell component="th" scope="row">
                      {0}
                    </StyledTableCell>
                    <StyledTableCell align="right">{0}</StyledTableCell>
                    <StyledTableCell align="right">{0}</StyledTableCell>
                    <StyledTableCell align="right">{0}</StyledTableCell>
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
