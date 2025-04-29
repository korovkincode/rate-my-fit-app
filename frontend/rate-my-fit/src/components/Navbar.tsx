import { useState, MouseEvent, useContext } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link as LinkDOM } from 'react-router-dom';
import { AuthContext } from '../context';
import secureLocalStorage from 'react-secure-storage';

const Navbar = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;
    const username = secureLocalStorage.getItem('username');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUserCredentials({
            'userToken': '', 'secretToken': ''
        });
        if ('username' in secureLocalStorage) {
            delete secureLocalStorage['username'];
        }
        handleClose();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    RateMyFit
                </Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    sx={{ mt: '30px' }}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {userCredentials.userToken !== ''
                        ?
                        <> 
                            <MenuItem onClick={handleClose}>
                                <LinkDOM to={`/user/@${username}`} style={{ textDecoration: 'none' }}>
                                    <Typography color="primary.main" variant="body1">
                                        Profile
                                    </Typography>
                                </LinkDOM>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography color="#FFFFFF" variant="body1">
                                    Logout
                                </Typography>
                            </MenuItem>
                        </>
                        : 
                        <>
                            <MenuItem onClick={handleClose}>
                                <LinkDOM to="/login" style={{ textDecoration: 'none' }} >
                                    <Typography color="primary.main" variant="body1">
                                        Login
                                    </Typography>
                                </LinkDOM>
                            </MenuItem>
                        </>
                    }
                </Menu>
            </Toolbar>
        </AppBar>
        </Box>
    );
};

export default Navbar;