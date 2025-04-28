import { useState, useContext } from 'react';
import { AuthContext } from '../context';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { UserCredentials, FormType, FormData, FormStatus } from '../types/user';

const UserForm = ({ actionType }: { actionType: FormType}) => {
    const [userData, setUserData] = useState<FormData>({
        username: '', password: '', previousPassword: '', bio: ''
    });
	const [formStatus, setFormStatus] = useState<FormStatus>({status: '', description: ''});
    const authContext = useContext(AuthContext);
    
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }

    const [userCredentials, setUserCredentials] = authContext;

    return (
        <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2} alignItems="center">
                {formStatus.description !== '' &&
                    <Grid sx={{ mb: 2 }} size={{ xs: 12 }}>
                        <Typography sx={{ fontWeight: 'bold' }} color={`${formStatus.status}.main`}>
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
                {actionType === 'update' &&
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            required value={userData.previousPassword}
                            onChange={e => setUserData({...userData, previousPassword: e.target.value})}
                            fullWidth label="Previous password" type="password" placeholder="Enter your previous password"
                        />
                    </Grid>
                }
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
                            required value={userData.password}
                            onChange={e => setUserData({...userData, password: e.target.value})}
                            fullWidth label="Bio" placeholder="Tell us about yourself"
                        />
                    </Grid>
                }
            </Grid>
            <Button
                type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {{'signup': 'Sign up', 'login': 'Login', 'update': 'Update'}[actionType]}
            </Button>
        </Box>
    );
};

export default UserForm;