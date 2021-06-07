import React, {useState} from 'react';
import { Box, Button, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import DatePicker from "./DatePicker";
import axios from 'axios';
import { SERVER_BASE_URL, SERVER_RESPONSE_OK } from '../../constants';
import MyBarChart from './MyBarGraph';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
}));


const StatsPanel = ({getAppState, setAppState}) =>{
    const [fromDate, setFromDate] = React.useState(new Date());
    const [toDate, setToDate] = React.useState(new Date());
    const classes = useStyles();
    const {stats, userId} = getAppState();

    const onGetStatsClick = async() =>{
        //setAppState({stats: {guests:100, subscribers:200, owners:10, managers:30, system_managers:2}});
        const statsResponse = await axios.post(SERVER_BASE_URL+'/getLoginStats', {
            userId,
            from:fromDate.toString(),
            until: toDate.toString()
        });
        switch(statsResponse.status){
            case SERVER_RESPONSE_OK:
                setAppState({stats: statsResponse.data})
                break;
            default:
                alert("couldn't load stats - remove this alert")
        }
    }

    return(
        <Paper width="500" alignSelf="center">
            <Typography variant="h5" align="justify">
                &nbsp;&nbsp;&nbsp; View number of users by type:
            </Typography>
            <Grid container classes={classes.root} justify="space-around" alignItems="center">
                <Grid item xs={1}/>
                <Grid item xs={3}>
                    <DatePicker selectedDate={fromDate} setSelectedDate={setFromDate} label="From"/>
                </Grid>
                <Grid item xs={3}>
                    <DatePicker selectedDate={toDate} setSelectedDate={setToDate} label="To"/>
                </Grid>
                <Grid item xs={2}>
                    <Button onClick={onGetStatsClick} variant="contained" color="primary">Get</Button>
                </Grid>
                <Grid item xs={3}/>
            </Grid>
            {
                stats ? <MyBarChart getAppState={getAppState}/> : <h1>Search for stats</h1>
            }
        </Paper>
    );

}
export default StatsPanel;