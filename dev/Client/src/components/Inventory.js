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

const editProduct = (product) =>
{
  alert(`edit product ${product.productId}`)
}

export default function Inventory({getAppState, setAppState, inventory}) {
  const classes = useStyles();

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
                  <StyledTableCell>product id</StyledTableCell>
                  <StyledTableCell align="right">product name</StyledTableCell>
                  <StyledTableCell align="right">quantity</StyledTableCell>
                  <StyledTableCell align="right">price per product</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory === undefined ? <ProgressWheel/>:inventory.map((item) => (
                  <StyledTableRow key={item.productId} onClick={(e) => editProduct(item)}>
                    <StyledTableCell component="th" scope="row">{item.productId} </StyledTableCell>
                    <StyledTableCell align="right">{item.productName}</StyledTableCell>
                    <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                    <StyledTableCell align="right">{item.price}</StyledTableCell>
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
