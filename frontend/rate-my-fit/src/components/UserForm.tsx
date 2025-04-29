import { useContext, useState } from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { FormType, Form, FormStatus } from '../types/user';
import { signupUser, loginUser } from '../API/user';
import { AuthContext } from '../context';
import secureLocalStorage from 'react-secure-storage';

const UserForm = ({ actionType }: { actionType: FormType}) => {
    const [userData, setUserData] = useState<Form>({
        username: '', password: '', bio: ''
    });
	const [formStatus, setFormStatus] = useState<FormStatus>({status: '', description: ''});

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;

    const handleForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus({status: '', description: ''});

        if (userData.username === '' || userData.password === '') {
            setFormStatus({status: 'error', description: 'Please fill in all fields'});
            return;
        }
        
        let formResponse;
        if (actionType === 'signup') {
            formResponse = await signupUser(userData);
        } else if (actionType === 'login') {
            formResponse = await loginUser(userData);
        } else if (actionType === 'update') {

        }

        if (formResponse.status !== 200) {
            setFormStatus({status: 'error', description: formResponse.description});
            return;
        }

        setFormStatus({status: 'success', description: formResponse.message});
        setUserCredentials(formResponse.data);
        secureLocalStorage.setItem('username', userData.username);
    };

    return (
        <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2} alignItems="center">
                {formStatus.description !== '' &&
                    <Grid sx={{ mb: 2 }} size={{ xs: 12 }}>
                        <Typography
                            sx={{ fontWeight: 'bold' }} color={`${formStatus.status}.main`}
                        >
                            {formStatus.description}
                        </Typography>
                    </Grid>
                }
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={userData.username}
                        onChange={e => setUserData({...userData, username: e.target.value})}
                        fullWidth label="Username" placeholder={actionType !== 'login' ? 'Choose a username' : 'Enter your username'}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={userData.password}
                        onChange={e => setUserData({...userData, password: e.target.value})}
                        fullWidth label="Password" type="password" placeholder={actionType !== 'login' ? 'Choose a password' : 'Enter your password'}
                    />
                </Grid>
                {actionType !== 'login' &&
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            value={userData.bio}
                            onChange={e => setUserData({...userData, bio: e.target.value})}
                            fullWidth label="Bio" placeholder="Tell us about yourself"
                        />
                    </Grid>
                }
            </Grid>
            <Button
                type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
                onClick={handleForm}
            >
                {{'signup': 'Sign up', 'login': 'Login', 'update': 'Update'}[actionType]}
            </Button>
        </Box>
    );
};

export default UserForm;