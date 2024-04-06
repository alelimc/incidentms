import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from '../lib/auth-helper'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './../assets/images/Logo.jpg'; 

const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ff4081' } : { color: '#ffffff' };
};
const isPartActive = (location, path) => {
  if (location.pathname.includes(path))
    return { color: '#bef67a' }
  else
    return { color: '#ffffff' }
}
export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <AppBar position="static" style={{ backgroundColor: '#1bb1d6' }}> 
        <Toolbar>
        {/* Logo Image */}
        <img src={Logo} alt="Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />

        {/* Title */}
        <Typography variant="h6" color="primary">
          Incident Management System
        </Typography>
        
        {/* Home Link */}
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(location, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>

        {/* Users Link */}
        {/* <Link to="/users">
          <Button style={isActive(location, "/users")}>Users</Button>
        </Link> */}

        {/* Authentication Links */}
        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
          </span>
        )}

        {/* Authenticated User Links */}
        {auth.isAuthenticated() && (
          <span>
            {auth.isAuthenticated().user && auth.isAuthenticated().user.seller && (
              <Link to="/seller/shops">
                <Button style={isPartActive(location, "/seller/")}>Report Now</Button>
              </Link>
            )}
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>Profile</Button>
            </Link>
            <Button color="inherit" onClick={() => {
              auth.clearJWT(() => navigate('/'));
            }}>Sign out</Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
}
