import React, { useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {Search} from './Search'
import axios from 'axios';
import history from '../history';
import {SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK} from '../constants';
import { Link } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import { initialAppState } from './componentUtil';

const BASE_URL = SERVER_BASE_URL;


const getUsername =  async (userId) =>
{
  const res =  axios.post(`${SERVER_BASE_URL}getUsername`, {userId} )
  .then()
  return userId;
}
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

export default function Banner({getAppState, setAppState}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const {IsStoreManager} = getAppState();
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleManageSystemClick = () => {
    history.push('/managesystem');
  };


  const {userId, isGuest} = getAppState();
  const isSystemManager = true;
  

  const handleManageStoresClick = async () => {
    const response = await axios.post(SERVER_BASE_URL+'/getUserStores',{userId});
    switch(response.status){
      case SERVER_RESPONSE_OK:
        const stores = JSON.parse(response.data).stores;
        setAppState({stores});
            history.push('/manageStores');
            return;
        case SERVER_RESPONSE_BAD:
            alert(response.data);
            return;
        default:
            alert(`unexpected response code: ${response.status}`);
            return;
    }
  };


  const handleCartClick = async () => {
    const response = await axios.post(SERVER_BASE_URL+'/getCartInfo',{userId});
    switch(response.status){
        case SERVER_RESPONSE_OK:
            const cart = JSON.parse(response.data);
            setAppState({cart});
            history.push('/cart');
            return;
        case SERVER_RESPONSE_BAD:
            alert(response.data.message);
            return;
        default:
            alert(`unexpected response code: ${response.status}`);
            return;
    }
  };
  const handleTransactionsClick = async () => {
    const response = await axios.post(BASE_URL+'getMyPurchaseHistory',{userId});
    switch(response.status){
      case SERVER_RESPONSE_OK:
        setAppState({myTransactions: JSON.parse(response.data)});
        history.push('/mytransactions');
        return;
      case SERVER_RESPONSE_BAD:
        alert(response.data.message);
        return;
      default:
        alert(`unknown response code ${response.status}`);
        return;
    }
  };

  const handleComplainClick  = () => {
    history.push('/complain');
  };

  const handleOpenStoreClick  = () => {
    history.push('/openstore');
  };

  const handleLogoutClick  = async () => {
    //handleMenuClose();
    await axios.post(BASE_URL+'logout',{userId});
    const wsConn = getAppState().wsConn;
    if (wsConn !== undefined)
      wsConn.close();
    history.push('/');
    setAppState(initialAppState);
  };

  const handleSignInClick = () => {
    history.push('/auth');
  }
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isSystemManager ? <MenuItem onClick={handleManageSystemClick}>Manage System</MenuItem> : <div></div>}
      {IsStoreManager    ? <MenuItem onClick={handleManageStoresClick}>Manage stores</MenuItem> : <div></div>}
      { isGuest ?
          <MenuItem onClick={handleSignInClick}>Sign in</MenuItem> :
        <div>
          
          <MenuItem onClick={handleCartClick}>Cart</MenuItem>
          <MenuItem onClick={handleTransactionsClick}>Transactions</MenuItem>
          <MenuItem onClick={handleComplainClick}>Complain</MenuItem>
          <MenuItem onClick={handleOpenStoreClick}>Open Store</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </div>
      }
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
             {getAppState().username}
          </Typography>
          <Search getAppState={getAppState} setAppState={setAppState}/>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="view shopping cart" color="inherit" onClick={handleCartClick}>
              <Badge badgeContent={0} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
