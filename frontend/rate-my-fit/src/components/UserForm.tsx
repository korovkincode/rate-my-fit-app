import { useContext, useState, FormEvent } from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';
import { Form, FormType } from '../types/user';
import { SnackbarStatus } from '../types/UI';
import { addUser, authUser } from '../API/user';
import { AuthContext } from '../context';
import secureLocalStorage from 'react-secure-storage';
import Snackbar from './UI/snackbar';
import { capitalize } from '../utils';

interface UserFormProps {
    actionType: FormType
};

const UserForm = ({ actionType }: UserFormProps) => {
    const [userData, setUserData] = useState<Form>({
        username: '', password: '', bio: ''
    });

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [_, setUserCredentials] = authContext;

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        if (userData.username === '' || userData.password === '') {
            setSnackbarStatus({
                open: true, message: 'Fill in all fields', color: 'error'
            });
            return;
        }
        
        let formResponse;
        if (actionType === 'sign up') {
            formResponse = await addUser(userData);
        } else if (actionType === 'login') {
            formResponse = await authUser(userData);
        } else if (actionType === 'update') {

        }

        if (formResponse.status !== 200) {
            setSnackbarStatus({
                open: true, message: formResponse.description, color: 'error'
            });
            return;
        }

        setUserCredentials(formResponse.data);
        secureLocalStorage.setItem('username', userData.username);
        setSnackbarStatus({
            open: true, message: formResponse.message, color: 'success'
        });
    };

    const [snackbarStatus, setSnackbarStatus] = useState<SnackbarStatus>({
        open: false, message: '', color: 'info'
    });

    return (
        <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={userData.username}
                        onChange={e => setUserData({...userData, username: e.target.value})}
                        fullWidth label="Username"
                        placeholder={actionType !== 'login' ? 'Choose a username' : 'Enter your username'}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={userData.password}
                        onChange={e => setUserData({...userData, password: e.target.value})}
                        fullWidth label="Password" type="password"
                        placeholder={actionType !== 'login' ? 'Choose a password' : 'Enter your password'}
                    />
                </Grid>
                {actionType !== 'login' &&
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            value={userData.bio} onChange={e => setUserData({...userData, bio: e.target.value})}
                            fullWidth label="Bio" placeholder="Tell us about yourself"
                        />
                    </Grid>
                }
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleForm}>
                {capitalize(actionType)}
            </Button>
            <Snackbar status={snackbarStatus} setStatus={setSnackbarStatus} />
        </Box>
    );
};

export default UserForm;