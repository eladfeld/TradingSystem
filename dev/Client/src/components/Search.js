import React, { useState } from 'react'
import axios from 'axios';
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
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import {SERVER_BASE_URL , SERVER_RESPONSE_OK, SERVER_RESPONSE_BAD} from '../constants'



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
                    <SearchIcon onClick={showSidebar} color='secondary'/>
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
            //TODO: turn alerts into the nice material-ui ones!!!
            
            axios.post(SERVER_BASE_URL+'/getCartInfo',{userId}).then(response =>
                {
                    switch(response.status){
                        case SERVER_RESPONSE_OK:
                            const cart = JSON.parse(response.data);
                            setAppState({cart});
                            break;
                        case SERVER_RESPONSE_BAD:
                            alert(response.data.message);
                            break;
                        default:
                            alert(`unexpected response code: ${response.status}`);
                            break;
                    }
                } )
            alert("product added successfully")
        }
        else
        {
            alert("could not add product")
        }
    }
    return(
        <div> 
            {
                (products === undefined || products.length === 0 ) ? <h1></h1> :             
                <Grid item align='right'>
                    <Button variant="contained" color="secondary" startIcon={<DeleteIcon/>}
                        onClick={reset}>
                        clear
                    </Button>
                </Grid>
            }      
            {/* <Grid item align='right'>
                <Button variant="contained" color="secondary" startIcon={<DeleteIcon/>}
                        onClick={reset}>
                    clear
                </Button>
            </Grid> */}

        <List className={classes.search} subheader={<li />} align='right' style={paperStyle}>
            {
            products === null || products === undefined ? <h1></h1> :
            products.map((product) => (
                <li key={`${product.productName}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`item-${product.productName}`} align='center'>
                        <Grid container  align='right' style={paperStyle}>
                            <Grid item align='left' xs={5} >
                                <img length='100' height='100' src={"https://osemcat.signature-it.com/images/Fittings/osem-hq/Upload_Pictures/Prod_Pic/6901353/Catalog/6901353_7290000068787_L_1_Enlarge.jpg"}>
                                    
                                </img>
                            </Grid>
                            <Grid item xs={4} align='center'>
                                <ListItemText primary={`name: ${product.productName}`} />
                                <ListItemText primary={`price: ${product.price}$`} />
                                <ListItemText primary={`store: ${product.storeName}`} />
                            </Grid>
                            <Grid item xs={3} align='right'>
                                <Button variant="contained" color="primary" startIcon={<AddIcon/>}
                                        onClick={() => addToCart(product.storeId, product.productId)}>
                                    add to cart
                                </Button>
                            </Grid>

                        </Grid>
                    </ListItem>
                    
                </ul>
                </li>
            ))}
            </List>
    </div>
    )
}

export const SearchByName=({getAppState, setAppState, intersect})=>{
    const [name, setName] = useState('')
    const [products_options , setProductsOptions] = useState(undefined)
    const userId = getAppState().userId;

    if (products_options === undefined)
    {
        const products = axios.get(`${SERVER_BASE_URL}getProductNames`);
        products.then( res => {
            setProductsOptions(JSON.parse(res.data));
        })
    }

    const searchByName = async (productName) =>
    {
        axios.post(`${SERVER_BASE_URL}getPruductInfoByName`, {userId, productName} ).then(res => intersect(getAppState().productsm, JSON.parse(res.data)['products']))
    }

    return(
        <div key={getAppState().products}>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search by product name</h2>
            </Grid>
            <TextInput
                placeholder='Enter product name'
                trigger = {['']}
                spacer = {[""]}
                options = {products_options}
                onRequestOptions = {(text) => { setName(text)}}
                onSelect = {(text) => setName(text)}
                onChange = { (text) => { setName(text)}}
            />
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

export const SearchByCategory= ({getAppState, setAppState, intersect})=>{
    const [category, changeCategory] = useState('')
    const [productsByCategory, setProductsByCategory] = useState([])
    const [category_options , setCategoryOptions] = useState(undefined)
    const userId = getAppState().userId;
    const classes = useStyles();

    
    if (category_options === undefined)
    {
        const catagories = axios.get(`${SERVER_BASE_URL}getAllCategories`);
        catagories.then( res => {
            setCategoryOptions(JSON.parse(res.data));
        })
    }

    const searchByCategory = async (category) =>
    {
        axios.post(`${SERVER_BASE_URL}getPruductInfoByCategory`, {userId, category} ).then(res => intersect(getAppState().productsm, JSON.parse(res.data)['products']))
    }

    return(
        <div >
        <Banner getAppState={getAppState} setAppState={setAppState}/>

        <Grid>
            <Grid align='center'>
                <h2>Search by product category</h2>
            </Grid>
            <TextInput
                placeholder='Enter category'
                trigger = {['']}
                spacer = {[""]}
                options = {category_options}
                onRequestOptions = {(text) => { changeCategory(text)}}
                onSelect = {(text) => changeCategory(text)}
                onChange = { (text) =>  changeCategory(text)}
            />
            <Grid item align='right'>
                <Button variant="contained" color="primary" startIcon={<SearchIcon/>} onClick={() => searchByCategory(category)} >
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
    const [keyword_options , setKeywordOptions] = useState(undefined)
    const [key, setKey] = useState('')

    const classes = useStyles();
    const userId = getAppState().userId;

    if (keyword_options === undefined)
    {
        const keywords = axios.get(`${SERVER_BASE_URL}getkeywords`);
        keywords.then( res => {
            setKeywordOptions(JSON.parse(res.data));
        })
    }

    const searchByName = async (productName) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByName`, {userId, productName} )
        setProductsByName(JSON.parse(res.data)['products'])
        if(productsByName !== null && productsByName !== undefined && productsByName.length !== 0){
            setProductsByKeyword(productsByName)
        }
    }

    const searchByCategory = async (category) =>
    {
        const res = await axios.post(`${SERVER_BASE_URL}getPruductInfoByCategory`, {userId, category} )
        setProductsByCategory(JSON.parse(res.data)['products'])
        if(productsByCategory !== null && productsByCategory !== undefined && productsByCategory.length !== 0){

            setProductsByKeyword(productsByCategory)
        }
    }

    const enlist = async (strToSearch) => {
        setProductsByKeyword([])
        searchByName(strToSearch)
        searchByCategory(strToSearch)

        productsByName !== null && productsByName !== undefined && productsByName.length !== 0 ? setProductsByKeyword(productsByCategory) :
        productsByCategory !== null && productsByCategory !== undefined && productsByCategory.length !== 0 ? setProductsByKeyword(productsByName) :
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
            <TextInput
                placeholder='Enter keyword'
                trigger = {['']}
                spacer = {[""]}
                options = {keyword_options}
                onRequestOptions = {(text) => { setKey(text)}}
                onSelect = {(text) => setKey(text)}
                onChange = { (text) => { setKey(text)}}
            />
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
    const userId = getAppState().userId;

    const classes = useStyles();

    const SearchBelowPrice = async (price) =>
    {
        if(Number.isInteger(price)){
            alert("not a number")
        }
        else {
            axios.post(`${SERVER_BASE_URL}getPruductInfoBelowPrice`, {userId, price }).then(res => intersect(getAppState().productsm, JSON.parse(res.data)['products']))
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
    const userId = getAppState().userId;

    const classes = useStyles();

    const SearchAbovePrice = async (price) =>
    {
        if(Number. isInteger(price)){
            alert("not a number")
        }
        else{
            axios.post(`${SERVER_BASE_URL}getPruductInfoAbovePrice`, {userId, price} ).then(res => intersect(getAppState().productsm, JSON.parse(res.data)['products']))
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
    const [store_options , setStoreOptions] = useState(undefined)
    const userId = getAppState().userId;


    if (store_options === undefined)
    {
        const stores = axios.get(`${SERVER_BASE_URL}getStoreNames`);
        stores.then( res => {
            setStoreOptions(JSON.parse(res.data));
        })
    }

    const SearchByStore = async (store) =>
    {
        axios.post(`${SERVER_BASE_URL}getPruductInfoByStore`, {userId, store} ).then(res => intersect(getAppState().productsm, JSON.parse(res.data)['products']))

    }
    return(
        <div>
        <Banner getAppState={getAppState} setAppState={setAppState}/>
        <Grid>
            <Grid align='center'>
                <h2>Search Store</h2>
            </Grid>
            <TextInput
                placeholder='Enter Store Name'
                trigger = {['']}
                spacer = {[""]}
                options = {store_options}
                onRequestOptions = {(text) => { setKey(text)}}
                onSelect = {(text) => setKey(text)}
                onChange = { (text) => { setKey(text)}}
            />
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