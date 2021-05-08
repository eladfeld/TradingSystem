import React, { useState } from 'react'
import axios from 'axios';
import {SERVER_BASE_URL} from '../constants'
import { fade, makeStyles } from '@material-ui/core/styles';
import Banner from './Banner';
import {List, ListItemText, ListItem, Grid, Button, TextField, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import PaymentIcon from '@material-ui/icons/Payment';


const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }));

  const SidebarData = [
    {
      title: 'Product',
      path: '/search/name',
      cName: 'nav-text'
    },
    {
      title: 'Category',
      path: '/search/category',
      cName: 'nav-text'
    },
    {
      title: 'Keyword',
      path: '/search/keyword',
      cName: 'nav-text'
    },
    {
      title: 'Below Price',
      path: '/search/belowprice',
      cName: 'nav-text'
    },
    {
      title: 'Above Price',
      path: '/search/aboveprice',
      cName: 'nav-text'
    },
    {
      title: 'Store',
      path: '/search/store',
      cName: 'nav-text'
    }
  ];

export const Search=({getAppState, setAppState, intersect})=>{
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const classes = useStyles();

    return(
        <div>
            <IconContext.Provider value={{ color: '#fff' }}>
            <div>
                <Link to='#' className='menu-bars'>
                    <SearchIcon onClick={showSidebar} />
                </Link>
            </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                            </li>
                        );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    )
}


export const Products=({getAppState, setAppState})=>{
    const classes = useStyles();
    const {products} = getAppState();
    const reset = () => setAppState({products:[]});
    const paperStyle={padding :20,width:400, margin:"20px auto"}
    const userId = getAppState().userId;

    const addToCart = async (storeId, productId) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}addProductTocart`, {userId, storeId, productId, quantity:1} )
        if(res.status === 200)
        {
            alert("product added successfully")
        }
        else
        {
            alert("could not add product")
        }
    }
    return(
        <div>
        <Grid item align='right'>
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon/>}
                    onClick={reset}>
                clear
            </Button>
        </Grid>
        <List className={classes.search} subheader={<li />} align='right' style={paperStyle}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.productName}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productName}`} align='center'>
                        <Grid container maxWidth={10} align='right' style={paperStyle}>
                            <Grid item xs={9} md={6} maxWidth={10} align='center'>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2} align='right'>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => addToCart(product.storeId, product.productId)}>
                                    add to cart
                                </Button>
                            </Grid>

                        </Grid>
                    </ListItem>
                    )
                </ul>
                </li>
            ))}
            </List>
    </div>
    )
}

export const SearchByName=({getAppState, setAppState, intersect})=>{
    const [productsByName, setProductsByName] = useState([])
    const [name, setName] = useState('')
    const userId = getAppState().userId;

    const searchByName = async (productName) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByName`, {userId, productName} )
        setProductsByName(JSON.parse(res.data)['products'])
        if(productsByName !== null || productsByName !== undefined ){
            intersect(getAppState().products, productsByName)
        }
    }

    return(
        <div key={getAppState().products}>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search by product name</h2>
            </Grid>
            <TextField
                placeholder='Enter product name'
                onChange={(event) => setName(event.target.value)}
            fullWidth/>
            <Grid item align='right'>
                <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => searchByName(name)} >
                    search
                </Button>
            </Grid>

        </Grid>
        <Products getAppState={getAppState} setAppState={setAppState}/>

    </div>
    )
}

export const SearchByCategory=({getAppState, setAppState, intersect})=>{
    const [cat, setCat] = useState('')
    const [productsByCategory, setProductsByCategory] = useState([])

    const userId = getAppState().userId;
    const classes = useStyles();

    const searchByCategory = async (category) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByCategory`, {userId, category} )
        setProductsByCategory(JSON.parse(res.data)['products'])
        if(productsByCategory !== null || productsByCategory !== undefined ){

            intersect(getAppState().products, productsByCategory)
        }
    }
    return(
        <div >
        <Banner getAppState={getAppState} setAppState={setAppState}/>

        <Grid>
            <Grid align='center'>
                <h2>Search by product category</h2>
            </Grid>
            <TextField
                placeholder='Enter category'
                onChange={(event) => setCat(event.target.value)}
            fullWidth/>
            <Grid item align='right'>
                <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => searchByCategory(cat)} >
                    search
                </Button>
            </Grid>
        </Grid>
        <Products getAppState={getAppState} setAppState={setAppState}/>
    </div>
    )
}

export const SearchByKeyword=({getAppState, setAppState, intersect})=>{
    const [productsByKeyword, setProductsByKeyword] = useState([])
    const [productsByName, setProductsByName] = useState([])
    const [productsByCategory, setProductsByCategory] = useState([])
    const [key, setKey] = useState('')

    const classes = useStyles();
    const userId = getAppState().userId;

    const searchByName = async (productName) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByName`, {userId, productName} )
        setProductsByName(JSON.parse(res.data)['products'])
        if(productsByName !== null || productsByName !== undefined ){
            setProductsByKeyword(productsByName)
        }
    }

    const searchByCategory = async (category) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByCategory`, {userId, category} )
        setProductsByCategory(JSON.parse(res.data)['products'])
        if(productsByCategory !== null || productsByCategory !== undefined ){

            setProductsByKeyword(productsByCategory)
        }
    }

    const enlist = async (strToSearch) => {
        setProductsByKeyword([])
        searchByName(strToSearch)
        console.log('by name')

        searchByCategory(strToSearch)
        console.log('by cat')

        productsByName === null || productsByName === undefined ? setProductsByKeyword(productsByCategory) :
        productsByCategory === null || productsByCategory === undefined ? setProductsByKeyword(productsByName) :
        setProductsByKeyword([...new Set([...productsByName,...productsByCategory])])
        intersect(getAppState().products, productsByKeyword)

    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search by keyword</h2>
            </Grid>
            <TextField
                placeholder='Enter keyword'
                onChange={(event) => setKey(event.target.value)}
            fullWidth/>
            <Grid item align='right'>
            <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => enlist(key)} >
                search
            </Button>
            </Grid>
        </Grid>
        <Products getAppState={getAppState} setAppState={setAppState}/>
    </div>
    )
}

export const SearchBelowPrice=({getAppState, setAppState, intersect})=>{
    const [key, setKey] = useState('')
    const [productsBelowPrice, setProductsBelowPrice] = useState([])
    const userId = getAppState().userId;

    const classes = useStyles();

    const SearchBelowPrice = async (price) =>
    {
        if(Number.isInteger(price)){
            alert("not a number")
        }
        else {
            const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoBelowPrice`, {userId, price })
            setProductsBelowPrice(JSON.parse(res.data)['products'])
            if(productsBelowPrice !== null || productsBelowPrice !== undefined ){
                intersect(getAppState().products,  productsBelowPrice)
            }
        }
    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search Below price</h2>
            </Grid>
            <TextField
                placeholder='Enter price'
                onChange={(event) => setKey(event.target.value)}
            fullWidth/>
            <Grid item align='right'>
            <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => SearchBelowPrice(key)} >
                search
            </Button>
            </Grid>
        </Grid>
        <Products getAppState={getAppState} setAppState={setAppState}/>
    </div>
    )
}

export const SearchAbovePrice=({getAppState, setAppState, intersect})=>{
    const [key, setKey] = useState('')
    const [productsAbovePrice, setProductsAbovePrice] = useState([])
    const userId = getAppState().userId;

    const classes = useStyles();

    const SearchAbovePrice = async (price) =>
    {
        if(Number. isInteger(price)){
            alert("not a number")
        }
        else{
            const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoAbovePrice`, {userId, price} )
            setProductsAbovePrice(JSON.parse(res.data)['products'])
            if(productsAbovePrice !== null || productsAbovePrice !== undefined ){
                intersect(getAppState().products, productsAbovePrice)
            }
        }
    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search above price</h2>
            </Grid>
            <TextField
                placeholder='Enter price'
                onChange={(event) => setKey(event.target.value)}
            fullWidth/>
            <Grid item align='right'>
            <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => SearchAbovePrice(key)} >
                search
            </Button>
            </Grid>
        </Grid>
        <Products getAppState={getAppState} setAppState={setAppState}/>
    </div>
    )
}


export const SearchByStore=({getAppState, setAppState, intersect})=>{
    const [key, setKey] = useState('')
    const [productsByStore, setProductsByStore] = useState([])
    const userId = getAppState().userId;

    const SearchByStore = async (rating) =>
    {
        if(Number. isInteger(rating)){
            alert("not a number")
        }
        else{
            const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByStore`, {userId, rating} )
            setProductsByStore(JSON.parse(res.data)['products'])
            if(productsByStore !== null || productsByStore !== undefined ){
                intersect(getAppState().products, productsByStore)
            }
        }
    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search Store</h2>
            </Grid>
            <TextField
                placeholder='Enter Store Name'
                onChange={(event) => setKey(event.target.value)}
            fullWidth/>
            <Grid item align='right'>
            <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => SearchByStore(key)} >
                search
            </Button>
            </Grid>
        </Grid>
        <Products getAppState={getAppState} setAppState={setAppState}/>
    </div>
    )
}

export default {
    Search,
    SidebarData
}