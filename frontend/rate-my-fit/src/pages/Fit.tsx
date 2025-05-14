import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { ChatBubble, Send } from '@mui/icons-material';
import { AuthContext } from '../context';
import { useParams, useNavigate, Link as LinkDOM } from 'react-router-dom';
import { Fit as FitT } from '../types/fit';
import { User, UserPreview } from '../types/user';
import { Item } from '../types/item';
import { Review } from '../types/review';
import { sleep, formatDate, getTodayDate, getAvgGrade } from '../utils';
import { getFit } from '../API/fit';
import { getItem } from '../API/item';
import { Container, Stack, Card, CardMedia, Skeleton, CardHeader, Avatar, Box, Typography, Divider, TextField, InputAdornment, Rating, IconButton } from '@mui/material';
import { API_URL } from '../API/API';
import Stepper from '../components/UI/stepper';
import ItemsTable from '../components/ItemsTable';
import { Shake } from '../components/UI/animations';
import { getUser, getUserPfpDirect } from '../API/user';
import { addReview, getFitReviews } from '../API/review';
import ReviewsTable from '../components/ReviewsTable';
import ReviewCard from '../components/ReviewCard';
import { SnackbarStatus } from '../types/UI';
import Snackbar from '../components/UI/snackbar';

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

    const [snackbarStatus, setSnackbarStatus] = useState<SnackbarStatus>({
        open: false, message: '', color: 'info'
    });

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
    const [reviewsData, setReviewsData] = useState<Review[] | null>(null);
    const [reviewersData, setReviewersData] = useState<{
        [userID: string]: UserPreview
    } | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

    const [galleryIndex, setGalleryIndex] = useState<number>(0);
    const navigate = useNavigate();
    const itemRedirect = (itemData: Item) => navigate(`/item/${itemData.itemID}`);

    const fetchFit = async () => {
        await sleep(1000); //To test skeleton loading
        const fitRequest = await getFit(fitID);
        if (fitRequest.status !== 200) {
            setSnackbarStatus({
                open: true, message: fitRequest.description, color: 'error'
            });
            throw new Error(fitRequest.description);
        }
        setFitData(fitRequest.data);

        const userRequest = await getUser(fitRequest.data.authorToken, null);
        if (userRequest.status !== 200) {
            setSnackbarStatus({
                open: true, message: userRequest.description, color: 'error'
            });
            throw new Error(userRequest.description);
        }
        setAuthorData(userRequest.data);
        setAuthorPfpLink(await getUserPfpDirect(fitRequest.data.authorToken));

        let tempItemsData = {} as { [itemID: string]: Item };
        for (const itemID of fitRequest.data.itemsID) {
            if (itemID in tempItemsData) continue;

            const itemRequest = await getItem(itemID);
            if (itemRequest.status !== 200) {
                throw new Error(itemRequest.description);
            }
            tempItemsData[itemID] = itemRequest.data;
        }
        setItemsData(tempItemsData);
    };

    const fetchReviews = async () => {
        await sleep(1000); //To test skeleton loading
        const reviewsRequest = await getFitReviews(fitID);
        if (reviewsRequest.status !== 200) {
            setSnackbarStatus({
                open: true, message: reviewsRequest.description, color: 'error'
            });
            throw new Error(reviewsRequest.description);
        }
        setReviewsData(reviewsRequest.data.reverse());

        let tempReviewersData = {} as {[userID: string]: UserPreview};
        for (const reviewItem of reviewsRequest.data) {
            tempReviewersData[reviewItem.authorToken] = await fetchReviewer(reviewItem.authorToken);
        }
        setReviewersData(tempReviewersData);
    };

    const fetchReviewer = async (userToken: string) => {
        const reviewerRequest = await getUser(userToken, null);
        if (reviewerRequest.status !== 200) {
            setSnackbarStatus({
                open: true, message: reviewerRequest.description, color: 'error'
            });
            throw new Error(reviewerRequest.description);
        }
        return {
            username: reviewerRequest.data.username,
            pfpLink: await getUserPfpDirect(userToken)
        };
    };

    useEffect(() => {
        setFitData(null);
        setItemsData(null);
        setAllDataLoaded(false);

        fetchFit();
        fetchReviews();
    }, [fitID]);

    useEffect(() => {
        setAllDataLoaded(
            [fitData, authorData, authorPfpLink, itemsData, reviewsData, reviewersData].every(el => el !== null)
        );
    }, [fitData, authorData, authorPfpLink, itemsData, reviewsData, reviewersData]);

    const reviewCommentEl = useRef<HTMLInputElement>(null);
    const [reviewGrade, setReviewGrade] = useState<number | null>(null);

    const handleReview = async () => {
        if (userCredentials.userToken === '') {
            setSnackbarStatus({
                open: true, message: 'You have to be authorized for this action', color: 'error'
            });
            return;
        }

        const reviewComment = reviewCommentEl.current?.value;
        if (reviewComment === '' || !reviewGrade) {
            setSnackbarStatus({
                open: true, message: 'Fill in all fields', color: 'error'
            });
            return;
        }
        const newReview = {
            fitID: fitID, grade: reviewGrade,
            date: getTodayDate(), comment: reviewComment || null,
        };
        const reviewRequest = await addReview({
            ...newReview, userCredentials: userCredentials
        });

        if (reviewRequest.status !== 200) {
            setSnackbarStatus({
                open: true, message: reviewRequest.description, color: 'error'
            });
            return;
        }
        const newReviewer = await fetchReviewer(userCredentials.userToken);
        setSnackbarStatus({
            open: true, message: 'Successfully added the review', color: 'success'
        });
        if (reviewCommentEl.current) {
            reviewCommentEl.current.value = '';
        }
        setReviewGrade(null);
        setReviewsData([reviewRequest.data, ...(reviewsData || [])]);
        setReviewersData({
            ...reviewersData, [userCredentials.userToken]: newReviewer
        });
    };

    return (
        <>
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
                                    setter={setGalleryIndex} stickBottom={true}
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
                                pt: {xs: authorCardHeight + 4, sm: 0}
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
                <Divider
                    variant="middle"
                    sx={{ mt: 6, borderBottomWidth: 3 }}
                />
                <Container maxWidth="sm">
                    {fitData && authorData && authorPfpLink && reviewsData && reviewersData && allDataLoaded
                    ?
                    <>
                        {fitData.description &&
                            <Box sx={{ mt: 3, mb: 2 }}>
                                <ReviewCard reviewData={{
                                    fitID: fitID,
                                    grade: 0,
                                    date: fitData.date,
                                    comment: fitData.description,
                                    reviewID: fitID,
                                    authorToken: fitData.authorToken
                                }} authorData={{
                                    username: authorData.username,
                                    pfpLink: authorPfpLink
                                }}
                                />
                            </Box>
                        }
                        <Stack direction="column" sx={{ mt: 4, mb: 5 }}>
                            <TextField
                                sx={{ mb: 1 }} inputRef={reviewCommentEl}
                                label="Review" placeholder="Share your thoughts"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ChatBubble />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton sx={{ pr: 0 }} onClick={handleReview}>
                                                    <Send />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    },
                                }}
                            />
                            <Rating value={reviewGrade} onChange={(_, value) => setReviewGrade(value)} />
                        </Stack>
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            mt: 2, mb: 2
                        }}>
                            <Typography sx={{ fontSize: 35, fontWeight: 700 }}>
                                {reviewsData.length} Review{reviewsData.length !== 1 ? 's' : ''}
                            </Typography>
                            {reviewsData.length > 0 &&
                                <Typography sx={{ fontWeight: 700 }}>
                                    {getAvgGrade(reviewsData).toFixed(1)}⭐
                                </Typography>
                            }
                        </Box>
                        <ReviewsTable
                            reviewsData={reviewsData} reviewersData={reviewersData}
                        />
                    </>
                    :
                    <>
                        <Skeleton variant="rectangular" sx={{
                            width: '100%', height: '120px', mt: 3, mb: 2, borderRadius: 5
                        }} />
                        <Skeleton variant="rectangular" sx={{
                            width: '100%', height: '60px', mt: 4, mb: 1
                        }} />
                        <Rating disabled sx={{ mb: 5 }} />
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            mt: 2, mb: 2
                        }}>
                            <Skeleton variant="rectangular" sx={{ width: '175px', height: '35px' }} />
                            <Skeleton variant="rectangular" sx={{ width: '40px', height: '20px' }} />
                        </Box>
                        {Array(6).fill(0).map((_, index) =>
                            <Skeleton
                                key={index}
                                variant="rectangular" 
                                sx={{ 
                                    width: '100%', height: '120px', mb: 2, borderRadius: 5
                                }}
                            />
                        )}
                    </>
                    }
                </Container>
            </Container>
            <Snackbar status={snackbarStatus} setStatus={setSnackbarStatus} />
        </>
    );
};

export default Fit;