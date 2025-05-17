import { Review } from '../types/review';
import { Card, CardHeader, Avatar, CardContent, Typography, Rating, styled } from '@mui/material';
import { Link as LinkDOM } from 'react-router-dom';
import { Star, PushPin } from '@mui/icons-material';
import { Shake, Shine } from './UI/animations';
import { formatDate } from '../utils';

const ShiningStar = styled('span')(() => ({
    WebkitMaskImage: 'linear-gradient(-75deg, rgba(0,0,0,0.6) 30%, #000 50%, rgba(0,0,0,0.6) 70%)',
    WebkitMaskSize: '200%',
    animation: `${Shine} 2s linear infinite`,
}));

interface ReviewCardProps {
    reviewData: Review,
    authorData: {
        username: string,
        pfpLink: string
    }
};

const ReviewCard = ({ reviewData, authorData }: ReviewCardProps) => (
    <Card sx={{ 
        borderRadius: 5, mb: 2
    }}>
        <CardHeader
            avatar={
                <LinkDOM to={`/user/@${authorData.username}`}>
                    <Avatar
                        alt={authorData.username}
                        src={authorData.pfpLink}
                        sx={{ mr: 0.5, animation: `${Shake(1.1, 3)} 2s ease infinite` }} 
                    />
                </LinkDOM>
            }
            slotProps={{
                title: {fontSize: 24, fontWeight: 700},
                subheader: {fontSize: 14, fontWeight: 300}
            }}
            title={authorData.username} subheader={formatDate(reviewData.date)}
            action={
                reviewData.grade
                ?
                    <Rating
                        sx={{ mt: '9px' }} value={reviewData.grade} readOnly
                        icon={
                            <ShiningStar>
                                <Star />
                            </ShiningStar>
                        }
                    />
                :
                    <PushPin sx={{
                        mt: '9px', mr: '5px', transform: 'rotate(45deg)'
                    }} />
            }
        />
        {reviewData.comment &&
            <CardContent sx={{ mt: -2, mb: -1 }}>
                <Typography variant="body1">
                    {reviewData.comment}
                </Typography>
            </CardContent>
        }
    </Card>
);

export default ReviewCard;