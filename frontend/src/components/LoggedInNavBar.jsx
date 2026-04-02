import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

//Assets
import userIcon from '../assets/user-icon.png';

//MUI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Grid} from '@mui/material';

const pages = [
  { label: 'Discover', path: '/discover' },
  { label: 'Create Recipe', path: '/create-recipe' },
];
const loggedInSettings = [
  {label:'Profile', path: '/profile'},
  {label:'My Recipes', path: '/my-recipes'},
  {label:'Logout', path: '/'},
];
const loggedOutSettings = [
  {label:'Login', path:'/login'}
];

function LoggedInNavBar() {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //Use the proper settings based on user loggin status
  const settings = user ? loggedInSettings : loggedOutSettings;

  const handleUserClick = (path, label) => {
    handleCloseUserMenu();
    if (label === 'Logout') {
      logout();
      navigate('/');
    } else navigate(path);
  }

  const handleNavClick = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  

  return (
    <AppBar position="sticky" >
      <Box sx={{ width: '100%', background:'#1E6B52' }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 8 }} offset={{ md: 2 }} px={{ xs: 2, md: 0 }} >
            <Toolbar disableGutters>

              {/* DESKTOP: Logo*/}
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                RecipeBook
              </Typography>


                {/* MOBILE: Hamburger menu + dropdown */}
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: 'block', md: 'none' } }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.label} onClick={() => handleNavClick(page.path)}>
                      <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* MOBILE: Logo */}
              <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'Roboto',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                RecipeBook
              </Typography>

              {/* DESKTOP: Nav page buttons */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2}}>
                {pages.map((page) => (
                  <Button
                    key={page.label}
                    onClick={() => handleNavClick(page.path)}
                    sx={{ my: 2, color: 'white', display: 'block'}}
                  >
                    {page.label}
                  </Button>
                ))}
              </Box>

              {/* DESKTOP + MOBILE: User avatar + settings dropdown */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {user ?
                    <Avatar sx={{ bgcolor: '#F5C842', color: '#1E6B52', fontWeight: 700 }}>
                      {user ? user.username.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                    :
                    <Avatar src={userIcon} sx={{width: 36, height: 36}}></Avatar>
                    }
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.label} onClick={()=>{handleUserClick(setting.path, setting.label)}}>
                      <Typography sx={{ textAlign: 'center' }}>{setting.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Grid>
        </Grid>
      </Box>
    </AppBar>
  );
}
export default LoggedInNavBar;