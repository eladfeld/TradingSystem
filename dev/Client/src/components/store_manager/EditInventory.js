import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Button, Grid, TextField } from '@material-ui/core';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../../constants';
import axios from 'axios';
import { isNonNegativeInteger } from '../componentUtil';
import Alert from '@material-ui/lab/Alert';

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

export default function EditInventory({getAppState, setAppState, product, setPage}) {
  const classes = useStyles();
  const {inventory, userId, storeId} = getAppState(); 
  const [quantity, setQuantity] = useState(product.quantity)
  const onBackClick = () => {setPage("inventory")}
  const [problem, setProblem] = useState("");
  const onUpdateQuantity = async (_quantity, productId) =>{

    if(!isNonNegativeInteger(_quantity)){
        setProblem('quantity must be a non-negative number');
        return;
    }
    axios.post(SERVER_BASE_URL+'editStoreInventory',{
        userId: userId,
        storeId: storeId,
        productId: productId,
        quantity: Number(_quantity)
        }).then(response =>{
            switch(response.status){
                case SERVER_RESPONSE_OK:
                  inventory.find(p => p.productId === productId).quantity = _quantity;
                  product.quantity = _quantity;
                  setQuantity(product.quantity);
                  setAppState({inventory});
                  return;
                case SERVER_RESPONSE_BAD:
                  setProblem(response.data);
                  setQuantity(product.quantity);
                  return;
                default:
                  setProblem(`unknown response code ${response.status}`);
                  return;
            }
        })

    }
  return (
    <div>
        {
            problem !== "" ?
            <Alert
            action={
                <Button color="inherit" size="small" onClick={() => {setProblem("")}}>
                close
                </Button>
            }
            severity="error"> {problem}</Alert> : <a1></a1>
        } 
        <Grid container>
            <Grid item xs={0} sm={4} ></Grid>
            <Grid item xs={12} sm={4}>
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
                    {
                        <StyledTableRow key={`t${product.productId}-p${product.productId}`}>
                        <StyledTableCell component="th" scope="row">
                            {product.productName}
                        </StyledTableCell>
                        <StyledTableCell align="left">              
                            <TextField
                            type="number"
                            id="outlined-size-small"
                            onChange = {(e) => onUpdateQuantity(e.target.value, product.productId)}
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value = {quantity}
                            />
                         </StyledTableCell>    
                        <StyledTableCell component="th" scope="row">
                            {`${product.price}$`}
                        </StyledTableCell>
                        </StyledTableRow>
                        }
                    </TableBody>
                </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={0} sm={4}></Grid>
        </Grid>
        <Box textAlign="center" marginTop={2}>
            <Button variant="contained" color="primary" onClick= {() => onBackClick()}>
                Back
            </Button>
        </Box>
    </div>
  );
}