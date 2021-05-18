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
import { Box, Button, Grid } from '@material-ui/core';
import Banner from './Banner';

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

export default function MyTransaction({getAppState, setAppState}) {
  const classes = useStyles();
  const {myTansactionToView} = getAppState();

  const onBackClick = () =>{
      history.push('/mytransactions');
  }
  return (
    <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid container>
            <Grid item xs={0} sm={4} md={5}></Grid>
            <Grid item xs={12} sm={4} md={2}>
                <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Product</StyledTableCell>
                        <StyledTableCell align="left">Quantity</StyledTableCell>
                        <StyledTableCell align="left">Price</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {myTansactionToView.items.map((item) => (
                        <StyledTableRow key={`t${myTansactionToView.transactionId}-p${item.productId}`}>
                        <StyledTableCell component="th" scope="row">
                            {item.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">{item.Quantity}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                            {`${item.price}$`}
                        </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={0} sm={4} md={5}></Grid>
        </Grid>
        <Box textAlign="center" marginTop={2}>
            <Button variant="contained" color="primary" onClick= {() => onBackClick()}>
                Back
            </Button>
        </Box>
    </div>
  );
}
