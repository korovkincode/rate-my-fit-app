import { useState, useContext, useEffect, MouseEvent } from 'react';
import { AuthContext } from '../context';
import { useParams } from 'react-router-dom';
import { Stack, Box, Container, Avatar, Typography, Grid, Skeleton, Divider, Popover } from '@mui/material';
import { getUser, getUserPfp } from '../API/user';
import { API_URL } from '../API/API';
import { sleep, getPfpToken } from '../utils';
import { Fit } from '../types/fit';
import { Item } from '../types/item';
import FitCard from '../components/FitCard';
import { getUserFits } from '../API/fit';
import { getItem } from '../API/item';

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
    const [editMode, setEditMode] = useState(false);
    const [userFits, setUserFits] = useState<Fit[] | null>(null);
    const [itemsData, setItemsData] = useState<{
        [itemID: string]: Item
    } | null>(null);
    const [usernamesData, setUsernamesData] = useState<{
        [userID: string]: string
    } | null>(null);

    useEffect(() => {
        setUserData(null);
        setPfpLink(null);
        setUserFits(null);

        const fetchUser = async () => {
            await sleep(1000); //To test skeleton loading
            const userRequest = await getUser(userID, null);
            if (userRequest.status !== 200) {
                throw new Error(userRequest.description);
            } else {
                setUserData(userRequest.data);
                setUsernamesData({ [userRequest.data.userToken]: userRequest.data.username });
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

        const fetchFits = async () => {
            await sleep(1000); //To test skeleton loading
            const fitsRequest = await getUserFits(userID);
            if (fitsRequest.status !== 200) {
                throw new Error(fitsRequest.description);
            } else {
                setUserFits(fitsRequest.data);
                let tempItemsData = {} as { [itemID: string]: Item };

                for (const fit of fitsRequest.data) {
                    for (const itemID of fit.itemsID) {
                        if (itemID in tempItemsData) continue;

                        const itemRequest = await getItem(itemID);
                        if (itemRequest.status !== 200) {
                            throw new Error(itemRequest.description);
                        } else {
                            tempItemsData[itemID] = itemRequest.data;
                        }
                    }
                }
                setItemsData(tempItemsData);
            }
        }

        fetchUser();
        fetchFits();
    }, [userID]);

    useEffect(() => {
        setUserDataLoaded(userData !== null && pfpLink !== null);
        setEditMode(pfpLink !== null && userCredentials.userToken === getPfpToken(pfpLink));
        setUserFitsLoaded(userFits !== null && itemsData !== null);
    }, [userData, pfpLink, userFits, itemsData, usernamesData, userCredentials]);

    return (
        <>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ mt: 6, justifyContent: 'center' }}
                spacing={{ xs: 4, sm: 10}}
            >
                <Box sx={{ alignSelf: 'center' }}>
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
                </Box>
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: { xs: 'center', sm: 'inherit' }
                }}>
                    {userDataLoaded
                    ? 
                    <>
                        <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
                            {userData?.username || ''}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '16px' }}>
                            {userData?.bio || 'no bio yet :('}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {userData?.totalFits} fit{userData?.totalFits !== 1 && 's'} • {userData?.totalReviews} review{userData?.totalReviews !== 1 && 's'}
                        </Typography>
                    </>
                    :
                    <>
                        <Skeleton component="h1" sx={{ mt : 1 }} width="200px"/>
                        <Skeleton sx={{ mt: 1.5 }} width="100px"/>
                        <Skeleton sx={{ mt : 2 }} width="130px" />
                    </>
                    }
                </Box>
            </Stack>
            <Container maxWidth="md">
                <Divider sx={{ mt: 6, borderBottomWidth: 3 }} />
                <Grid container spacing={2} sx={{ mt: 5 }}>
                    {userFitsLoaded && itemsData && usernamesData && (userFits?.length || 0) > 0
                    ?   userFits?.map((fit, index) =>
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <FitCard
                                    fitData={fit} itemsData={itemsData}
                                    usernamesData={usernamesData} authorPfpLink={pfpLink || ''}
                                />
                            </Grid>
                        )
                    :
                        !userData || userData && userData.totalFits > 0 
                        ?
                            Array(userData?.totalFits).fill(0).map((_, index) =>
                                <Grid size={{ xs: 12, md: 4 }} key={index}>
                                    <Skeleton
                                        variant="rectangular" 
                                        sx={{ 
                                            width: '100%', height: {xs: '100vw', md: '22vw'}
                                        }}
                                    />
                                </Grid>
                            )
                        :
                            <Typography>No fits</Typography>
                    }
                </Grid>
            </Container>
        </>
    );
}

export default Profile;