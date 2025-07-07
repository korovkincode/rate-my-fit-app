import { Review } from '../types/review';

import ReviewCard from './ReviewCard';

interface ReviewsTableProps {
  reviewsData: Review[]
};

const ReviewsTable = ({ reviewsData }: ReviewsTableProps) => (
  reviewsData.map((reviewData, index) => 
    <ReviewCard key={index} reviewData={reviewData} />
  )
);

export default ReviewsTable;