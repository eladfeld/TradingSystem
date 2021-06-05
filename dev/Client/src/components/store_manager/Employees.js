import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Grid } from '@material-ui/core';
import ProgressWheel from '../ProgreeWheel';
import ManageEmployee from './ManageEmployee';

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

export default function Employees({getAppState, setAppState, storeId}) {
    const classes = useStyles();
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const {staffToView} = getAppState();

    

    if(staffToView === null || staffToView === undefined){
        return <ProgressWheel/>;
    }

  const onManageClick = (emp) =>{
      if(selectedEmpId === emp.id)
        setSelectedEmpId(null);
      else setSelectedEmpId(emp.id);
  } 
  const updateEmployee = (emp) =>{
    staffToView.find( e => e.id=== emp.id).permission = emp.permission;
    setAppState({staffToView: [...staffToView]});
    setSelectedEmpId(null);
}

  const renderEmployee = (emp) =>{
    if(emp.id === selectedEmpId){
        return (
            <StyledTableRow key={emp.id}>
                <StyledTableRow key={`${emp.id}-static`}>
                <StyledTableCell component="th" scope="row">{emp.id}</StyledTableCell>
                <StyledTableCell align="left">{emp.username}</StyledTableCell>
                <StyledTableCell align="left">{emp.title}</StyledTableCell>
                <StyledTableCell align="left">
                    <Button onClick={() => onManageClick(emp)}>
                        Manage
                    </Button>
                </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow key={`${emp.id}-expanded`}>
                    <ManageEmployee getAppState={getAppState} setAppState={setAppState} emp={emp} storeId={storeId}
                        onEmpUpdate={updateEmployee}/>
                </StyledTableRow>
            </StyledTableRow>
        );
    }
    return (
        <StyledTableRow key={emp.id}>
          <StyledTableCell component="th" scope="row">{emp.id}</StyledTableCell>
          <StyledTableCell align="left">{emp.username}</StyledTableCell>
          <StyledTableCell align="left">{emp.title}</StyledTableCell>
          <StyledTableCell align="left">
              <Button onClick={() => onManageClick(emp)}>
                  Manage
              </Button>
          </StyledTableCell>
        </StyledTableRow>
      );
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
                  <StyledTableCell align="left">name</StyledTableCell>
                  <StyledTableCell align="left">Title</StyledTableCell>
                  <StyledTableCell align="left">Manage</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffToView.map((emp) => renderEmployee(emp))}              
              </TableBody>
            </Table>
          </TableContainer>
          </Grid>
          <Grid item xs={0} md={3}/>
      </Grid>
    </div>

  );
}
