import React, { useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Grid } from '@material-ui/core';
import ProgressWheel from './ProgreeWheel';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import HomeIcon from '@material-ui/icons/Home';
import { Button, ButtonGroup, Container, Paper, Typography, Link } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import history from '../history';
import Alert from '@material-ui/lab/Alert';
import { SERVER_BASE_URL } from '../constants';
import CategoryIcon from '@material-ui/icons/Category';

//style:
const paperStyle={padding :20,height:'70vh',width:500, margin:"20px auto"}
const btnstyle={margin:'8px 0'}
const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#00a152',
      },
      secondary: {
        main: '#d50000',
      },
    },
  });
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

export default function ManageCategories({getAppState, setAppState}) {
  const classes = useStyles();
  const {categories} = getAppState();
  const [main_cat, setMainCategory] = useState("");
  const [sub_cat, setSubCategory] = useState("");
  const [_isSucsess, setIsSucsess] = useState(false);
  const [_hasProblem, setHasProblem] = useState(false);
  const [problem, setProblem] = useState("");
  let storeId = getAppState().storeId
  let userId = getAppState().userId

  const addCat = async () =>
  {

      let category = ""
    if(main_cat === undefined || main_cat === null || main_cat === ""){
        category = sub_cat
    }
    else if(sub_cat === undefined || sub_cat === null || sub_cat === ""){
        category = main_cat
    }
    if (category !== ""){
        axios.post(`${SERVER_BASE_URL}addCategoryToRoot`, {userId, storeId, category})
        .then(res => {
            if(res.status == 200){
            setIsSucsess(true);
            }
            else if(res.status == 201)
            {
            setHasProblem(true);
            setProblem(res.data.error);
            clearFields();
            }
        })
        .catch()
    }
    else {
        axios.post(`${SERVER_BASE_URL}addCategory`, {userId, storeId, categoryFather:main_cat, category:sub_cat})
        .then(res => {
            if(res.status == 200){
            setIsSucsess(true);
            }
            else if(res.status == 201)
            {
            setHasProblem(true);
            setProblem(res.data.error);
            clearFields();
            }
        })
        .catch()
    }
  }
  const clearFields = () =>
  {
    setMainCategory("");
    setSubCategory("");
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
                  <StyledTableCell align="center">sub category</StyledTableCell>
                  <StyledTableCell align="center">main category</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories === undefined ? <ProgressWheel/>:categories.map((item) => (
                  <StyledTableRow key={item.productId} onClick={(e) => editProduct(item)}>
                    <StyledTableCell align="center">{item.sub_cat}</StyledTableCell>
                    <StyledTableCell align="center">{item.main_cat}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Grid>
          <Grid item xs={0} md={3}/>
      </Grid>
          <div className={classes.margin}>
          <div>
            {_isSucsess ?
            <Alert
            action={
              <Button color="inherit" size="small" onClick={() => {history.push('/welcome')}}>
                Back
              </Button>
            }
          >
            Category Added sussfully!
          </Alert> :
          _hasProblem ?
          <Alert severity="warning">A problem accured while adding the category: {problem}!</Alert>


          :<Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <h2>Add new category</h2>
                    </Grid>
                      <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                          <HomeIcon />
                        </Grid>
                        <Grid item>
                          <TextField
                              label='Main Category'
                              placeholder='Enter new category'
                              onChange={(event) => setMainCategory(event.target.value)}
                          fullWidth/>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                          <HomeIcon />
                        </Grid>
                        <Grid item>
                          <TextField
                              label='Sub Category'
                              placeholder='Leave empty if adding new main'
                              onChange={(event) => setSubCategory(event.target.value)}
                          fullWidth/>
                        </Grid>
                      </Grid>
                  <MuiThemeProvider theme={theme}>
                    <Button type='submit' color='primary' variant="contained"  style={btnstyle}
                        onClick={addCat}
                      fullWidth>add category
                    </Button>
                      <Button type='submit' color='secondary' variant="contained"  style={btnstyle}
                      onClick={(e) => clearFields()}
                        fullWidth>clear
                      </Button>
                    <Typography >
                        <Button onClick={() => {history.push('/welcome');}} >
                            back
                        </Button>
                    </Typography>
                    </MuiThemeProvider>

                </Paper>
            </Grid>
                    }

        </div>
        </div>
        </div>

  );
}
