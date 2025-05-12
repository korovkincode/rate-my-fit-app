import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { useParams, useNavigate, Link as LinkDOM } from 'react-router-dom';
import { Fit as FitT } from '../types/fit';
import { User } from '../types/user';
import { Item } from '../types/item';
import { sleep, formatDate } from '../utils';
import { getFit } from '../API/fit';
import { getItem } from '../API/item';
import { Container, Stack, Card, CardMedia, Skeleton, CardHeader, Avatar, Box } from '@mui/material';
import { API_URL } from '../API/API';
import Stepper from '../components/UI/stepper';
import ItemsTable from '../components/ItemsTable';
import { Shake } from '../components/UI/animations';
import { getUser, getUserPfpDirect } from '../API/user';

const Fit = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;

    const params = useParams();
    const fitID = params.fitID;

    if (!fitID) {
        throw new Error('Fit ID is not defined');
    }

    const [fitData, setFitData] = useState<FitT | null>(null);
    const [authorData, setAuthorData] = useState<User | null>(null);
    const [authorPfpLink, setAuthorPfpLink] = useState<string | null>(null);
    const [itemsData, setItemsData] = useState<{
        [itemID: string]: Item
    } | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

    const [galleryIndex, setGalleryIndex] = useState<number>(0);
    const navigate = useNavigate();
    const itemRedirect = (itemData: Item) => navigate(`/item/${itemData.itemID}`);

    useEffect(() => {
        setFitData(null);
        setItemsData(null);
        setAllDataLoaded(false);

        const fetchFit = async () => {
            await sleep(1000); //To test skeleton loading
            const fitRequest = await getFit(fitID);
            if (fitRequest.status !== 200) {
                throw new Error(fitRequest.description);
            } else {
                setFitData(fitRequest.data);
                const userRequest = await getUser(fitRequest.data.authorToken, null);
                if (userRequest.status !== 200) {
                    throw new Error(userRequest.description);
                } else {
                    setAuthorData(userRequest.data);
                    setAuthorPfpLink(await getUserPfpDirect(fitRequest.data.authorToken));
                }

                let tempItemsData = {} as { [itemID: string]: Item };
                for (const itemID of fitRequest.data.itemsID) {
                    if (itemID in tempItemsData) continue;

                    const itemRequest = await getItem(itemID);
                    if (itemRequest.status !== 200) {
                        throw new Error(itemRequest.description);
                    } else {
                        tempItemsData[itemID] = itemRequest.data;
                    }
                }
                setItemsData(tempItemsData);
            }
        };

        fetchFit();
    }, [fitID]);

    useEffect(() => {
        setAllDataLoaded(
            [fitData, authorData, authorPfpLink, itemsData].every(el => el !== null)
        );
    }, [fitData, authorData, authorPfpLink, itemsData]);

    console.log(fitData, itemsData, allDataLoaded);

    return (
        <Container maxWidth="md" sx={{
            mt: {xs: 0, sm: 3}, paddingLeft: {xs: 0}, paddingRight: {xs: 0}
        }}>
            <Stack spacing={0} justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
                {fitData && allDataLoaded
                ?
                <>
                    <Stack spacing={0} flexDirection="column">
                        <Card sx={{
                            borderRadius: {xs: '0 0 25px 25px', sm: '30px 0 0 30px'},
                            boxShadow: 3
                        }}>
                            <CardMedia
                                sx={{ maxHeight: {sm: 500} }}
                                component="img"
                                image={fitData.picnames ? `${API_URL}/static/${fitData.picnames[galleryIndex]}` : ''}
                                alt={`${fitData.title} - ${galleryIndex + 1}`}
                            />
                        </Card>
                        <Stepper length={fitData.picnames ? fitData.picnames.length : 0} step={galleryIndex} setter={setGalleryIndex} />
                    </Stack>
                </>
                :
                <Skeleton variant="rectangular" sx={{ width: '100%' }} />
                }
                {fitData && authorData && authorPfpLink && itemsData && allDataLoaded
                ?
                <Card sx={{
                    borderRadius: {xs: '0 0 0 0', sm: '0 30px 30px 0'}
                }}>
                    <CardHeader
                        sx={{ ml: '16px' }}
                        avatar={
                            <LinkDOM to={`/user/@${authorData.username}`}>
                                <Avatar
                                    alt={authorData.username}
                                    src={authorPfpLink}
                                    sx={{ mr: 0.5, animation: `${Shake(1.1, 3)} 2s ease infinite` }} 
                                />
                            </LinkDOM>
                        }
                        slotProps={{
                            title: {fontSize: 24, fontWeight: 700},
                            subheader: {fontSize: 14, fontWeight: 300}
                        }}
                        title={fitData.title} subheader={formatDate(fitData.date)}
                    />
                    <Box sx={{ bgcolor: 'custom.white', maxHeight: '461px', height: '100%', overflow: 'auto' }}>
                        <ItemsTable itemsData={itemsData} useType='fitCard' itemClick={itemRedirect} itemRemove={null} />
                    </Box>
                </Card>
                :
                <Skeleton variant="rectangular" sx={{ width: '100%' }} />
                }
            </Stack>
        </Container>
    );
};

export default Fit;