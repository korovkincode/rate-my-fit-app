import { useState, MouseEvent, useContext, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon, Avatar } from '@mui/material';
import { AccountCircle, Settings, Logout, Login, Person, PersonAdd } from '@mui/icons-material';
import { Link as LinkDOM } from 'react-router-dom';
import { AuthContext } from '../context';
import secureLocalStorage from 'react-secure-storage';
import { getUserPfpDirect } from '../API/user';

const Navbar = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;
    const [username, setUsername] = useState<string | null>((secureLocalStorage.getItem('username') || '') as string);
    const [pfpLink, setPfpLink] = useState<string | null>();

    useEffect(() => {
        setUsername((secureLocalStorage.getItem('username') || '') as string);

        const fetchPfp = async () => setPfpLink(await getUserPfpDirect(userCredentials.userToken));
        fetchPfp();
    }, [userCredentials, setUserCredentials]);
    
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
        secureLocalStorage.setItem('username', '');
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
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <Avatar sx={{ width: '45px', height: '45px' }} src={pfpLink || ''} />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {userCredentials.userToken !== ''
                        ?
                        <> 
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Person fontSize="small" />
                                </ListItemIcon>
                                <LinkDOM to={`/user/@${username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    Profile
                                </LinkDOM>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </>
                        : 
                        <>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                <LinkDOM to="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    Sign up
                                </LinkDOM>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Login fontSize="small" />
                                </ListItemIcon>
                                <LinkDOM to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    Login
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