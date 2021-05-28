import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';

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
    width:"100%"
  },
});

export default function AbstractTable({items, columnNames, renderRowCells, rowToKey, onRowClick}) {
  const classes = useStyles();

  if(!rowToKey){
      var rowKey = 0;
      rowToKey = (_) => `row_${rowKey++}`;
  }

  if(!onRowClick){
    onRowClick = () => {};
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
                    {columnNames.map(columnName => <StyledTableCell align="left">{columnName}</StyledTableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <StyledTableRow key={rowToKey(item)} onClick={(e) => onRowClick(item, e)}>
                      {renderRowCells(item).map(cell => <StyledTableCell align="left">{cell}</StyledTableCell>)}
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
