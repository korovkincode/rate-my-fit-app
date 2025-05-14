import { Review } from '../types/review';
import ReviewCard from './ReviewCard';

interface ReviewsTableProps {
    reviewsData: Review[],
    reviewersData: {
        [userID: string]: {
            username: string,
            pfpLink: string
        }
    },
};

const ReviewsTable = ({ reviewsData, reviewersData }: ReviewsTableProps) => (
    reviewsData.map((reviewData, index) => 
        <ReviewCard
            key={index} reviewData={reviewData}
            authorData={reviewersData[reviewData.authorToken]}
        />
    )
);

export default ReviewsTable;