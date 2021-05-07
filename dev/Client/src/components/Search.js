import React, { useState } from 'react'
import axios from 'axios';
import {SERVER_BASE_URL} from '../constants'
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import Banner from './Banner';
import {List, ListItemText, ListItem, Grid, Button, TextField, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import SearchIcon from '@material-ui/icons/Search';

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
      title: 'Above Rating',
      path: '/search/rating',
      cName: 'nav-text'
    }
  ];

export const Search=({getAppState, setAppState})=>{
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
    return(
        <div>
            <Banner getAppState={getAppState} setAppState={setAppState}/>
            <IconContext.Provider value={{ color: '#fff' }}>
            <div className='navbar'>
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

export const SearchByName=({getAppState, setAppState})=>{
    const [products, setProducts] = useState([])
    const [productsByName, setProductsByName] = useState([])

    const {userId} = getAppState();
    const classes = useStyles();
    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}

    const searchByName = async (productName) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByName`, {userId, productName} )
        setProductsByName(JSON.parse(res.data)['products'])
        if(productsByName !== null || productsByName !== undefined ){
            setProducts(productsByName)
        }
    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>

        <Grid>
            <Grid align='center'>
                <h2>Search by product name</h2>
            </Grid>
            <TextField
                placeholder='Enter product name'
                onChange={(event) => searchByName(event.target.value)}
            fullWidth/>
        </Grid>
        <List className={classes.root} subheader={<li />}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.product_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productId}`}>
                        <Grid container>
                            <Grid item xs={9} md={6}>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => {}}>
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

export const SearchByCategory=({getAppState, setAppState})=>{
    const [products, setProducts] = useState([])
    const [productsByCategory, setProductsByCategory] = useState([])

    const {userId} = getAppState();
    const classes = useStyles();

    const searchByCategory = async (category) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByCategory`, {userId, category} )
        setProductsByCategory(JSON.parse(res.data)['products'])
        if(productsByCategory !== null || productsByCategory !== undefined ){

            setProducts(productsByCategory)
        }
    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>

        <Grid>
            <Grid align='center'>
                <h2>Search by product category</h2>
            </Grid>
            <TextField
                placeholder='Enter category'
                onChange={(event) => searchByCategory(event.target.value)}
            fullWidth/>
        </Grid>
        <List className={classes.root} subheader={<li />}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.product_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productId}`}>
                        <Grid container>
                            <Grid item xs={9} md={6}>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => {}}>
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

export const SearchByKeyword=({getAppState, setAppState})=>{
    const [products, setProducts] = useState([])
    const [productsByName, setProductsByName] = useState([])
    const [productsByCategory, setProductsByCategory] = useState([])
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    const {userId} = getAppState();
    const classes = useStyles();

    const searchByName = async (productName) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByName`, {userId, productName} )
        setProductsByName(JSON.parse(res.data)['products'])
        if(productsByName !== null || productsByName !== undefined ){
            setProducts(productsByName)
        }
    }

    const searchByCategory = async (category) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByCategory`, {userId, category} )
        setProductsByCategory(JSON.parse(res.data)['products'])
        if(productsByCategory !== null || productsByCategory !== undefined ){

            setProducts(productsByCategory)
        }
    }

    const enlist = async (strToSearch) => {
        setProducts([])
        searchByName(strToSearch)
        console.log('by name')

        searchByCategory(strToSearch)
        console.log('by cat')

        productsByName === null || productsByName === undefined ? setProducts(productsByCategory) :
        productsByCategory === null || productsByCategory === undefined ? setProducts(productsByName) :
        setProducts([...new Set([...productsByName,...productsByCategory])])
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
                onChange={(event) => enlist(event.target.value)}
            fullWidth/>
        </Grid>
        <List className={classes.root} subheader={<li />}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.product_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productId}`}>
                        <Grid container>
                            <Grid item xs={9} md={6}>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => {}}>
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

export const SearchBelowPrice=({getAppState, setAppState})=>{
    const [products, setProducts] = useState([])
    const [productsBelowPrice, setProductsBelowPrice] = useState([])

    const {userId} = getAppState();
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
                setProducts(productsBelowPrice)
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
                onChange={(event) => SearchBelowPrice(event.target.value)}
            fullWidth/>
        </Grid>
        <List className={classes.root} subheader={<li />}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.product_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productId}`}>
                        <Grid container>
                            <Grid item xs={9} md={6}>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => {}}>
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

export const SearchAbovePrice=({getAppState, setAppState})=>{
    const [products, setProducts] = useState([])
    const [productsAbovePrice, setProductsAbovePrice] = useState([])

    const {userId} = getAppState();
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
                setProducts(productsAbovePrice)
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
                onChange={(event) => SearchAbovePrice(event.target.value)}
            fullWidth/>
        </Grid>
        <List className={classes.root} subheader={<li />}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.product_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productId}`}>
                        <Grid container>
                            <Grid item xs={9} md={6}>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => {}}>
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


export const SearchAboveRating=({getAppState, setAppState})=>{
    const [products, setProducts] = useState([])
    const [productsAboveRating, setProductsAboveRating] = useState([])

    const {userId} = getAppState();
    const classes = useStyles();
    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}

    const SearchAboveRating = async (rating) =>
    {
        if(Number. isInteger(rating)){
            alert("not a number")
        }
        else{
            const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoAboveRating`, {userId, rating} )
            setProductsAboveRating(JSON.parse(res.data)['products'])
            if(productsAboveRating !== null || productsAboveRating !== undefined ){
                setProducts(productsAboveRating)
            }
        }
    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>

        <Grid>
            <Grid align='center'>
                <h2>Search above rating</h2>
            </Grid>
            <TextField
                placeholder='Enter Rating'
                onChange={(event) => SearchAboveRating(event.target.value)}
            fullWidth/>
        </Grid>
        <List className={classes.root} subheader={<li />}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.product_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productId}`}>
                        <Grid container>
                            <Grid item xs={9} md={6}>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <Button variant="contained" color="inherit" startIcon={<AddIcon/>}
                                        onClick={() => {}}>
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