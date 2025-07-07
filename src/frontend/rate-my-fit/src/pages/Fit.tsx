import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Link as LinkDOM, useNavigate, useParams } from 'react-router-dom';

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Rating,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { ChatBubble, Send } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import type { Fit as FitT } from '../types/fit';
import type { Item } from '../types/item';
import type { Review } from '../types/review';
import type { SnackbarStatus } from '../types/UI';

import { formatDate, getTodayDate, failedRequest, getFullPfpPath } from '../utils';

import { API_URL } from '../API/API';
import { getFit } from '../API/fit';
import { getUser } from '../API/user';
import { addReview, getFitReviews } from '../API/review';

import { AuthContext } from '../context';

import Stepper from '../components/UI/stepper';
import { Shake } from '../components/UI/animations';
import Snackbar from '../components/UI/snackbar';
import ItemsTable from '../components/ItemsTable';
import ReviewsTable from '../components/ReviewsTable';
import ReviewCard from '../components/ReviewCard';

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
  const [userCredentials, _] = authContext;

  const params = useParams();
  const fitID = params.fitID;
  if (!fitID) {
    throw new Error('Fit ID is not defined');
  }

  const [fitData, setFitData] = useState<FitT | null>(null);
  const [reviewsData, setReviewsData] = useState<Review[] | null>(null);

  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const navigate = useNavigate();
  const itemRedirect = (itemData: Item) => navigate(`/item/${itemData.itemID}`);

  const fetchFit = async () => {
    const fitRequest = await getFit(fitID);
    if (fitRequest.status !== 200) {
      setSnackbarStatus({
        open: true, message: fitRequest.description, color: 'error'
      });
      throw new Error(fitRequest.description);
    }
    
    fitRequest.data.author.pfpLink = getFullPfpPath(fitRequest.data.author.pfpLink);
    setFitData(fitRequest.data);
  };

  const fetchReviews = async () => {
    const reviewsRequest = await getFitReviews(fitID);
    if (reviewsRequest.status !== 200) {
      setSnackbarStatus({
        open: true, message: reviewsRequest.description, color: 'error'
      });
      throw new Error(reviewsRequest.description);
    }

    for (let reviewIndex = 0; reviewIndex < reviewsRequest.data.length; reviewIndex++) {
      const reviewPfpLink = reviewsRequest.data[reviewIndex].author.pfpLink;
      reviewsRequest.data[reviewIndex].author.pfpLink = getFullPfpPath(reviewPfpLink);
    }
    setReviewsData(reviewsRequest.data);
  };

  useEffect(() => {
    setFitData(null);
    setReviewsData(null);

    Promise.all([fetchFit(), fetchReviews()]);
  }, [fitID]);

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
      failedRequest(setSnackbarStatus, reviewRequest.description);
    } else {
      const review = reviewRequest.data as Review;
      const newReviewer = await getUser(userCredentials.userToken, null);
      review.author = newReviewer;
      
      if (reviewCommentEl.current) {
        reviewCommentEl.current.value = '';
      }
      setReviewGrade(null);
      setReviewsData([review, ...(reviewsData || [])]);
      setSnackbarStatus({
        open: true, message: 'Successfully added the review', color: 'success'
      });
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{
        position: 'absolute', top: {xs: 53, sm: 100}, left: '50%',
        transform: 'translateX(-50%)', zIndex: -2,
        pl: 0, pr: 0,
      }}>
        <Stack spacing={0} justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
          {fitData
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
                        alt={fitData.author.username}
                        src={getFullPfpPath(fitData.author.pfpLink)}
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
          {fitData
            ?
            <>
              <Card sx={{
                borderRadius: {sm: '0 30px 30px 0'}
              }}>
                {!xsFlag &&
                  <CardHeader
                    sx={{ ml: '16px' }}
                    avatar={
                      <LinkDOM to={`/user/@${fitData.author.username}`}>
                        <Avatar
                          alt={fitData.author.username}
                          src={fitData.author.pfpLink}
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
                  {fitData.items &&
                    <ItemsTable itemsData={fitData.items} useType='fitCard' itemClick={itemRedirect} itemRemove={null} />
                  }
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
        <Divider variant="middle" sx={{ mt: 6, borderBottomWidth: 3 }} />
        <Container maxWidth="sm">
          {fitData && reviewsData
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
                    authorToken: fitData.authorToken,
                    author: fitData.author
                  }} />
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
                    {fitData.avgGrade.toFixed(1)}⭐
                  </Typography>
                }
              </Box>
              <ReviewsTable reviewsData={reviewsData} />
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