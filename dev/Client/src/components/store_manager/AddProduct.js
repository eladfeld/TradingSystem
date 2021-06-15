import React, { useState } from 'react'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Button, ButtonGroup, Container, Paper, Typography, Link } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import history from '../../history';
import Alert from '@material-ui/lab/Alert';
import { SERVER_BASE_URL } from '../../constants';
import CategoryIcon from '@material-ui/icons/Category';
import ImageIcon from '@material-ui/icons/Image';
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
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

//style:
const paperStyle={padding :20,height:'70vh',width:500, margin:"20px auto"}
const btnstyle={margin:'8px 0'}

export const AddProduct = ({getAppState, setAppState}) => {
    const [productName, setProductName] = useState("");
    const [categories, setCategories] = useState([]);
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [problem, setProblem] = useState("");
    const [success, setSuccess] = useState("")
    let storeId = getAppState().storeId
    let userId = getAppState().userId

    const classes = useStyles();

    const appoint = async () =>
    {
        axios.post(`${SERVER_BASE_URL}addNewProduct`, {userId, storeId, productName, categories, quantity, price, image})
        .then(res => {
          if(res.status == 200){
            clearFields()
            setSuccess("Product Added sussfully!")
            setProblem("")
          }
          else if(res.status == 201)
          {
            setProblem(res.data.error);
            setSuccess("")
            clearFields();
          }
        })
        .catch()
    }
    const clearFields = () =>
    {
        setProductName("");
        setCategories([]);
        setQuantity("");
        setPrice("");
    }

  return (
      <div className={classes.margin}>
      <div>
        {success !== "" ?
        <Alert
        action={
          <Button color="inherit" size="small" onClick={() => {history.push('/welcome')}}>
            Back
          </Button>
        }
      >
        {success}
      </Alert> :
      problem !== "" ?
      <Alert severity="warning">A problem accured while adding the product: {problem}!</Alert> :<a1></a1>
        }<Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <h2>Add new product</h2>
                </Grid>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <HomeIcon />
                    </Grid>
                    <Grid item>
                      <TextField style={{width:400}}
                          label='Product name'
                          placeholder='Enter new product name'
                          onChange={(event) => setProductName(event.target.value)}
                      fullWidth/>
                    </Grid>

                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <CategoryIcon />
                      </Grid>
                          <Grid item>
                          <TextField style={{width:400}}
                              label='Categories'
                              placeholder='Enter product categories split by comma'
                              onChange={(event) => setCategories(event.target.value.split(','))}
                          fullWidth/>
                          </Grid>
                      </Grid>

                      <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <BarChartIcon />
                      </Grid>
                      <Grid item>
                        <TextField style={{width:400}}
                            label='Quantity'
                            type="number"
                            placeholder='Enter product quantity available'
                            onChange={(event) => setQuantity(event.target.value)}
                        fullWidth/>
                      </Grid>
                      </Grid>
                      <Grid container spacing={1} alignItems="flex-end">

                      <Grid item>
                        <AttachMoneyIcon />
                      </Grid>
                      <Grid item>
                        <TextField style={{width:400}}
                            label='Price'
                            type="number"
                            placeholder='Enter product price'
                            onChange={(event) => setPrice(event.target.value)}
                        fullWidth/>
                      </Grid>
                      <Grid container spacing={1} alignItems="flex-end">

                      <Grid item>
                        <ImageIcon />
                      </Grid>
                      <Grid item>
                          <TextField style={{width:400}}
                              label='image'
                              placeholder='Enter an image url or local path'
                              onChange={(event) => setImage(event.target.value)}
                          fullWidth/>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
              <MuiThemeProvider theme={theme}>
                <Button type='submit' color='primary' variant="contained"  style={btnstyle}
                    onClick={appoint}
                  fullWidth>add product
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
    </div>
  </div>
  );
}

export default AddProduct;