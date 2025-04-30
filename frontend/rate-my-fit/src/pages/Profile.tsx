import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context';
import { useParams } from 'react-router-dom';
import { Container, Avatar, Typography, Grid, Box, Skeleton } from '@mui/material';
import { getUser, getUserPfp } from '../API/user';
import { API_URL } from '../API/API';
import { sleep } from '../utils';

const Profile = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;

    const [userDataLoaded, setUserDataLoaded] = useState(false);
    const [userFitsLoaded, setUserFitsLoaded] = useState(false);
    
    const params = useParams();
    const userID = params.userID;
    if (!userID) {
        throw new Error('User ID is not defined');
    }

    const [userData, setUserData] = useState<{
        username: string,
        bio: string | null,
        totalFits: number,
        totalReviews: number,
        userToken: string | null,
        secretToken: string | null,
        password: string | null,
    } | null>(null);
    const [pfpLink, setPfpLink] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            await sleep(1000); //To test skeleton loading
            const userRequest = await getUser(userID, userCredentials.secretToken);
            if (userRequest.status !== 200) {
                throw new Error(userRequest.description);
            } else {
                setUserData(userRequest.data);
            }

            const pfpRequest = await getUserPfp(userID);
            if (pfpRequest.status === 404) {
                setPfpLink('https://i.pinimg.com/originals/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg');
            } else if (pfpRequest.status === 200) {
                setPfpLink(`${API_URL}/pfp/${pfpRequest.data}`);
            } else {
                throw new Error(userRequest.description);
            }
        };

        fetchData();
    }, [userID]);

    useEffect(() => {
        if (userData && pfpLink) {
            setUserDataLoaded(true);
        }
    }, [userData, pfpLink]);

    return (
        <Container maxWidth="sm" sx={{ 
            marginTop: '2rem'
        }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {userDataLoaded && userData
                    ?
                        <Avatar
                            alt={userData.username || ''}
                            src={pfpLink || ''}
                            sx={{ width: '140px', height: '140px' }}
                        />
                    :
                        <Skeleton
                            variant="circular"
                            width={140}
                            height={140}
                        />
                    }
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'inherit' }
                    }}>
                        {userDataLoaded && userData
                        ? 
                        <>
                            <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
                                {userData.username || ''}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '16px' }}>
                                {userData.bio || 'no bio yet :('}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                {userData.totalFits} fit{userData.totalFits !== 1 && 's'} • {userData.totalReviews} review{userData.totalReviews !== 1 && 's'}
                            </Typography>
                        </>
                        :
                        <>
                            <Skeleton component="h1" sx={{ mt : 1 }} />
                            <Skeleton sx={{ mt: 1.5 }} />
                            <Skeleton sx={{ mt : 2 }} width="40%" />
                        </>
                        }
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;