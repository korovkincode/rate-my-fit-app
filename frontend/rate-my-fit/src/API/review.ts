import { APICall } from './API';
import { Form } from '../types/review';

export const addReview = async (reviewData: Form) => {
    const response = await APICall({
        method: 'POST',
        path: '/review/add',
        headers: null,
        body: reviewData,
        multipart: false
    });

    return response;
};

export const getReview = async (reviewID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/review/${reviewID}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const getUserReviews = async (userID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/review/by/${userID}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const getFitReviews = async (fitID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/review/on/${fitID}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};