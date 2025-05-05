import { useState, MouseEvent, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { AppBar, Container, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon, Avatar, Modal, Box } from '@mui/material';
import { Settings, Logout, Login, Person, PersonAdd, Add, AddAPhoto, Checkroom } from '@mui/icons-material';
import { Link as LinkDOM } from 'react-router-dom';
import { AuthContext } from '../context';
import secureLocalStorage from 'react-secure-storage';
import { getUserPfpDirect } from '../API/user';
import { Pulse } from './UI/animations';
import FitForm from './FitForm';
import { SnackbarStatus } from '../types/UI';
import Snackbar from './UI/snackbar';

const MenuSlotProps = {
    paper: {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
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
};

const ModalStyles = {
    overflow: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '350px',
    maxWidth: '400px',
    maxHeight: '100vh',
    bgcolor: '#D65076',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 10
};

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
    
    const handleLogout = () => {
        setUserCredentials({
            'userToken': '', 'secretToken': '', reloader: 0
        });
        secureLocalStorage.setItem('username', '');
        setUserMenuEl(null);
    }

    const [snackbarStatus, setSnackbarStatus] = useState<SnackbarStatus>({
        open: false, message: '', color: 'info'
    });

    const [addMenuEl, setAddMenuEl] = useState<null | HTMLElement>(null);
    const handleAddMenu = (event: MouseEvent<HTMLElement>) => {
        setAddMenuEl(event.currentTarget);
    };

    const addMenuChecker = (setter: Dispatch<SetStateAction<boolean>>) => {
        setAddMenuEl(null);

        if (userCredentials.userToken === '') {
            setSnackbarStatus({
                open: true, message: 'You have to be authorized for this action', color: 'error'
            });
        } else {
            setter(true);
        }
    };

    const [userMenuEl, setUserMenuEl] = useState<null | HTMLElement>(null);
    const handleUserMenu = (event: MouseEvent<HTMLElement>) => {
        setUserMenuEl(event.currentTarget);
    };

    const [fitFormOpen, setFitFormOpen] = useState<boolean>(false);
    const [itemFormOpen, setItemFormOpen] = useState<boolean>(false);

    return (
        <Container sx={{ pl: 0, r: 0 }}>
            <AppBar position="static" sx={{ borderRadius: 10 }}>
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
                        📊 FitRater
                    </Typography>
                    <IconButton size="large" onClick={handleAddMenu} color="success" sx={{ mr: 0 }}>
                        <Add />
                    </IconButton>
                    <IconButton size="large" onClick={handleUserMenu} color="inherit" sx={{ mr: -1 }}>
                        <Avatar src={pfpLink || ''} sx={{
                            width: '45px', height: '45px',
                            animation: `${Pulse(1.1)} 2s infinite`
                        }} />
                    </IconButton>
                    <Menu
                        id="user-menu-appbar" anchorEl={userMenuEl} keepMounted
                        open={Boolean(userMenuEl)} onClose={() => setUserMenuEl(null)}
                        slotProps={MenuSlotProps}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {userCredentials.userToken !== ''
                            ?
                            <> 
                                <MenuItem onClick={() => setUserMenuEl(null)}>
                                    <ListItemIcon>
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    <LinkDOM to={`/user/@${username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        Profile
                                    </LinkDOM>
                                </MenuItem>
                                <MenuItem onClick={() => setUserMenuEl(null)}>
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
                                <MenuItem onClick={() => setUserMenuEl(null)}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    <LinkDOM to="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        Sign up
                                    </LinkDOM>
                                </MenuItem>
                                <MenuItem onClick={() => setUserMenuEl(null)}>
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
                    <Menu
                        id="add-menu-appbar" anchorEl={addMenuEl} keepMounted
                        open={Boolean(addMenuEl)} onClose={() => setAddMenuEl(null)}
                        slotProps={MenuSlotProps}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => addMenuChecker(setFitFormOpen)}>
                            <ListItemIcon>
                                <AddAPhoto fontSize="small" />
                            </ListItemIcon>
                            Fit
                        </MenuItem>
                        <MenuItem onClick={() => addMenuChecker(setItemFormOpen)}>
                            <ListItemIcon>
                                <Checkroom fontSize="small" />
                            </ListItemIcon>
                            Item
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Modal keepMounted open={fitFormOpen} onClose={() => setFitFormOpen(false)}>
                <Box sx={ModalStyles}>
                    <FitForm actionType="add" openSetter={setFitFormOpen} snackbarSetter={setSnackbarStatus} />
                </Box>
            </Modal>
            <Snackbar status={snackbarStatus} setStatus={setSnackbarStatus} />
        </Container>
    );
};

export default Navbar;