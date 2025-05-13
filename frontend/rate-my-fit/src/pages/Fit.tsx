import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { AuthContext } from '../context';
import { useParams, useNavigate, Link as LinkDOM } from 'react-router-dom';
import { Fit as FitT } from '../types/fit';
import { User } from '../types/user';
import { Item } from '../types/item';
import { sleep, formatDate } from '../utils';
import { getFit } from '../API/fit';
import { getItem } from '../API/item';
import { Container, Stack, Card, CardMedia, Skeleton, CardHeader, Avatar, Box, Paper, Typography } from '@mui/material';
import { API_URL } from '../API/API';
import Stepper from '../components/UI/stepper';
import ItemsTable from '../components/ItemsTable';
import { Shake } from '../components/UI/animations';
import { getUser, getUserPfpDirect } from '../API/user';

const Fit = () => {
    const theme = useTheme();
    const xsFlag = useMediaQuery(theme.breakpoints.down('sm'));

    const authorCardRef = useRef<HTMLDivElement | null>(null);
    const [authorCardHeight, setAuthorCardHeight] = useState<number>(0);

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (authorCardRef.current) {
                setAuthorCardHeight(authorCardRef.current.getBoundingClientRect().height);
            }
        };
    
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

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

    return (
        <Container maxWidth="md" sx={{
            position: 'absolute', top: {xs: 53, sm: 100}, left: '50%',
            transform: 'translateX(-50%)', zIndex: -2,
            pl: 0, pr: 0,
        }}>
            <Stack spacing={0} justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
                {fitData && authorData && authorPfpLink && itemsData && allDataLoaded
                ?
                <>
                    <Stack spacing={0} flexDirection="column">
                        <Card sx={{
                            boxShadow: 3, position: 'relative', overflow: 'visible',
                            borderRadius: {sm: '30px 0 0 30px'}
                        }}>
                            <CardMedia
                                sx={{
                                    maxHeight: {sm: 500}, borderRadius: {sm: '30px 0 0 30px'}
                                }}
                                component="img"
                                image={fitData.picnames ? `${API_URL}/static/${fitData.picnames[galleryIndex]}` : ''}
                                alt={`${fitData.title} - ${galleryIndex + 1}`}
                            />
                            <Stepper
                                length={fitData.picnames ? fitData.picnames.length : 0} step={galleryIndex}
                                stickBottom={true} setter={setGalleryIndex}
                            />
                            {xsFlag &&
                                <Stack direction="row" spacing={2} ref={authorCardRef} sx={{
                                    width: '65%', bgcolor: 'custom.pink',
                                    justifyContent: 'center', alignItems: 'center',
                                    ml: 'auto', mr: 'auto',
                                    borderRadius: 6, zIndex: 1,
                                    position: 'absolute',  transform: 'translateX(-50%)',
                                    left: '50%', bottom: authorCardHeight - 36,
                                    pt: '5px', pb: '5px'
                                }}>
                                    <Avatar
                                        alt={authorData.username}
                                        src={authorPfpLink}
                                        sx={{ animation: `${Shake(1.1, 3)} 2s ease infinite` }} 
                                    />
                                    <Stack>
                                        <Typography fontSize={15} fontWeight={700}>
                                            {fitData.title}
                                        </Typography>
                                        <Typography fontSize={13} fontWeight={300}>
                                            {formatDate(fitData.date)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            }
                        </Card>
                    </Stack>
                </>
                :
                    <Skeleton 
                        variant="rectangular" animation="wave"
                        sx={{
                            width: '100%', height: 500,
                            borderRadius: {sm: '30px 0 0 30px'}
                        }}
                    />
                }
                {fitData && authorData && authorPfpLink && itemsData && allDataLoaded
                ?
                <>
                    <Card sx={{
                        borderRadius: {sm: '0 30px 30px 0'}
                    }}>
                        {!xsFlag &&
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
                        }
                        <Box sx={{
                            bgcolor: 'custom.white', maxHeight: '414px', height: '100%', overflow: 'auto',
                            pt: {xs: authorCardHeight + 5, sm: 0}
                        }}>
                            <ItemsTable itemsData={itemsData} useType='fitCard' itemClick={itemRedirect} itemRemove={null} />
                        </Box>
                    </Card>
                </>
                :
                    <Skeleton 
                        variant="rectangular" sx={{
                            width: '100%', height: 500,
                            borderRadius: {sm: '0 30px 30px 0'}
                        }}
                    />
                }
            </Stack>
            
        </Container>
    );
};

export default Fit;